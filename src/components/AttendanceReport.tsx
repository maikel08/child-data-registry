import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isWeekend, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import type { Student } from "./StudentForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GROUPS = ["Grupo A", "Grupo B", "Grupo C", "Grupo D"];

interface AttendanceReportProps {
  students: Student[];
}

interface AttendanceRecord {
  present: number;
  absent: number;
}

export const AttendanceReport = ({ students }: AttendanceReportProps) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedGroup, setSelectedGroup] = useState("");
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord>>({});

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end }).filter((day) => !isWeekend(day));
  };

  const workingDays = getDaysInMonth(selectedMonth);

  const filteredStudents = students
    .filter((s) => s.group === selectedGroup)
    .sort((a, b) => {
      const compareLastName1 = a.lastName1.localeCompare(b.lastName1);
      if (compareLastName1 !== 0) return compareLastName1;
      
      const compareLastName2 = a.lastName2.localeCompare(b.lastName2);
      if (compareLastName2 !== 0) return compareLastName2;
      
      return a.firstName.localeCompare(b.firstName);
    });

  useEffect(() => {
    if (selectedGroup && selectedMonth) {
      fetchAttendanceData();
    }
  }, [selectedGroup, selectedMonth]);

  const fetchAttendanceData = async () => {
    try {
      const startDate = startOfMonth(selectedMonth);
      const endDate = endOfMonth(selectedMonth);

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .gte("date", format(startDate, "yyyy-MM-dd"))
        .lte("date", format(endDate, "yyyy-MM-dd"));

      if (error) throw error;

      const attendanceCount: Record<string, AttendanceRecord> = {};

      if (data) {
        data.forEach((record) => {
          if (!attendanceCount[record.student_id]) {
            attendanceCount[record.student_id] = { present: 0, absent: 0 };
          }
          if (record.is_present) {
            attendanceCount[record.student_id].present += 1;
          } else {
            attendanceCount[record.student_id].absent += 1;
          }
        });
      }

      setAttendanceData(attendanceCount);
    } catch (error) {
      console.error("Error al cargar datos de asistencia:", error);
      toast.error("Error al cargar el reporte de asistencia");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Reporte de Asistencia</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Seleccionar Mes</h3>
          <Calendar
            mode="single"
            selected={selectedMonth}
            onSelect={(date) => date && setSelectedMonth(date)}
            locale={es}
            className="rounded-md border"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Seleccionar Grupo</h3>
          <Select
            value={selectedGroup}
            onValueChange={setSelectedGroup}
          >
            <SelectTrigger className="w-full">
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

      {selectedGroup && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Reporte del Mes: {format(selectedMonth, "MMMM yyyy", { locale: es })}
          </h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellidos</TableHead>
                  <TableHead className="text-center">Días Laborables</TableHead>
                  <TableHead className="text-center">Asistencias</TableHead>
                  <TableHead className="text-center">Ausencias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const record = attendanceData[student.id] || { present: 0, absent: workingDays.length };
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell>{student.firstName}</TableCell>
                      <TableCell>{`${student.lastName1} ${student.lastName2}`}</TableCell>
                      <TableCell className="text-center">{workingDays.length}</TableCell>
                      <TableCell className="text-center">{record.present}</TableCell>
                      <TableCell className="text-center">{workingDays.length - record.present}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};