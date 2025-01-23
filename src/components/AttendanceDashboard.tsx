import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Student } from "./StudentForm";

const GROUPS = ["Grupo A", "Grupo B", "Grupo C", "Grupo D"];

interface AttendanceDashboardProps {
  students: Student[];
}

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  total: number;
}

export const AttendanceDashboard = ({ students }: AttendanceDashboardProps) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedGroup, setSelectedGroup] = useState("");
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end }).filter((day) => !isWeekend(day));
  };

  useEffect(() => {
    if (selectedGroup && selectedMonth) {
      fetchAttendanceData();
    }
  }, [selectedGroup, selectedMonth]);

  const fetchAttendanceData = async () => {
    try {
      const startDate = startOfMonth(selectedMonth);
      const endDate = endOfMonth(selectedMonth);
      const workingDays = getDaysInMonth(selectedMonth);

      const { data: attendanceRecords, error } = await supabase
        .from("attendance")
        .select("date, is_present, student_id")
        .gte("date", format(startDate, "yyyy-MM-dd"))
        .lte("date", format(endDate, "yyyy-MM-dd"));

      if (error) throw error;

      const studentIds = students
        .filter((s) => s.group === selectedGroup)
        .map((s) => s.id);

      const dailyAttendance: Record<string, { present: number; absent: number }> = {};

      workingDays.forEach((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        dailyAttendance[dateStr] = { present: 0, absent: 0 };
      });

      if (attendanceRecords) {
        attendanceRecords.forEach((record) => {
          if (studentIds.includes(record.student_id)) {
            const dateStr = record.date;
            if (dailyAttendance[dateStr]) {
              if (record.is_present) {
                dailyAttendance[dateStr].present += 1;
              } else {
                dailyAttendance[dateStr].absent += 1;
              }
            }
          }
        });
      }

      const chartData: AttendanceData[] = Object.entries(dailyAttendance).map(([date, counts]) => ({
        date: format(new Date(date), "dd/MM"),
        present: counts.present,
        absent: counts.absent,
        total: studentIds.length,
      }));

      setAttendanceData(chartData);
    } catch (error) {
      console.error("Error al cargar datos de asistencia:", error);
      toast.error("Error al cargar datos de asistencia");
    }
  };

  const chartConfig = {
    present: {
      label: "Presentes",
      color: "#22c55e",
    },
    absent: {
      label: "Ausentes",
      color: "#ef4444",
    },
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard de Asistencia</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Mes</label>
          <Select
            value={format(selectedMonth, "yyyy-MM")}
            onValueChange={(value) => setSelectedMonth(new Date(value))}
          >
            <SelectTrigger>
              <SelectValue>
                {format(selectedMonth, "MMMM yyyy", { locale: es })}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date(selectedMonth.getFullYear(), i, 1);
                return (
                  <SelectItem key={i} value={format(date, "yyyy-MM")}>
                    {format(date, "MMMM yyyy", { locale: es })}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Grupo</label>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un grupo" />
            </SelectTrigger>
            <SelectContent>
              {GROUPS.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedGroup && attendanceData.length > 0 && (
        <div className="h-[400px] mt-6">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="present" fill={chartConfig.present.color} name="Presentes" />
                <Bar dataKey="absent" fill={chartConfig.absent.color} name="Ausentes" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </div>
  );
};