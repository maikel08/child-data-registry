import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { format, isWeekend, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import type { Student } from "./StudentForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GROUPS = ["Grupo A", "Grupo B", "Grupo C", "Grupo D"];

interface MonthlyAttendanceListProps {
  students: Student[];
}

interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  is_present: boolean;
}

export const MonthlyAttendanceList = ({ students }: MonthlyAttendanceListProps) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedGroup, setSelectedGroup] = useState("");
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, boolean>>>({});
  const [isEditing, setIsEditing] = useState(false);

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

      const attendanceMap: Record<string, Record<string, boolean>> = {};

      if (data) {
        data.forEach((record: AttendanceRecord) => {
          if (!attendanceMap[record.student_id]) {
            attendanceMap[record.student_id] = {};
          }
          attendanceMap[record.student_id][record.date] = record.is_present;
        });
      }

      setAttendanceData(attendanceMap);
    } catch (error) {
      console.error("Error al cargar datos de asistencia:", error);
      toast.error("Error al cargar los datos de asistencia");
    }
  };

  const handleAttendanceChange = (studentId: string, date: Date, checked: boolean) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [format(date, "yyyy-MM-dd")]: checked,
      },
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      const attendanceRecords = Object.entries(attendanceData).flatMap(([studentId, dates]) =>
        Object.entries(dates).map(([date, isPresent]) => ({
          student_id: studentId,
          date,
          is_present: isPresent,
        }))
      );

      const { error } = await supabase
        .from("attendance")
        .upsert(attendanceRecords, {
          onConflict: "student_id,date",
        });

      if (error) throw error;

      toast.success("Asistencia actualizada exitosamente");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar la asistencia:", error);
      toast.error("Error al guardar la asistencia");
    }
  };

  return (
    <div className="space-y-6 max-w-full mx-auto p-6 bg-white rounded-lg shadow overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-900">Lista de Asistencia Mensual</h2>

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Lista de Asistencia: {selectedGroup} - {format(selectedMonth, "MMMM yyyy", { locale: es })}
            </h3>
            <div className="space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Editar Asistencia
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    fetchAttendanceData();
                  }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveAttendance}>
                    Guardar Cambios
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellidos</TableHead>
                  {workingDays.map((day) => (
                    <TableHead key={day.toISOString()} className="text-center whitespace-nowrap">
                      {format(day, "dd MMM", { locale: es })}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell className="whitespace-nowrap">{`${student.lastName1} ${student.lastName2}`}</TableCell>
                    {workingDays.map((day) => {
                      const dateStr = format(day, "yyyy-MM-dd");
                      const isPresent = attendanceData[student.id]?.[dateStr] ?? false;

                      return (
                        <TableCell key={day.toISOString()} className="text-center">
                          {isEditing ? (
                            <Checkbox
                              checked={isPresent}
                              onCheckedChange={(checked) =>
                                handleAttendanceChange(student.id, day, checked as boolean)
                              }
                            />
                          ) : (
                            <span className={isPresent ? "text-green-600" : "text-red-600"}>
                              {isPresent ? "✓" : "✗"}
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};