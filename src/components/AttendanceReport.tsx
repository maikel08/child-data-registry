import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isWeekend, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import type { Student } from "./StudentForm";

// Importamos la misma lista de grupos que se usa en otros componentes
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

  // Obtener todos los días del mes seleccionado (excluyendo fines de semana)
  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end }).filter((day) => !isWeekend(day));
  };

  const workingDays = getDaysInMonth(selectedMonth);

  // Filtrar y ordenar estudiantes por apellidos y nombre
  const filteredStudents = students
    .filter((s) => s.group === selectedGroup)
    .sort((a, b) => {
      const compareLastName1 = a.lastName1.localeCompare(b.lastName1);
      if (compareLastName1 !== 0) return compareLastName1;
      
      const compareLastName2 = a.lastName2.localeCompare(b.lastName2);
      if (compareLastName2 !== 0) return compareLastName2;
      
      return a.firstName.localeCompare(b.firstName);
    });

  // Simular registros de asistencia (esto debería venir de tu base de datos)
  const getAttendanceRecord = (studentId: string): AttendanceRecord => {
    // Aquí deberías obtener los datos reales de asistencia
    return {
      present: Math.floor(Math.random() * workingDays.length),
      absent: 0, // Se calculará después
    };
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
                  const record = getAttendanceRecord(student.id);
                  record.absent = workingDays.length - record.present;
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell>{student.firstName}</TableCell>
                      <TableCell>{`${student.lastName1} ${student.lastName2}`}</TableCell>
                      <TableCell className="text-center">{workingDays.length}</TableCell>
                      <TableCell className="text-center">{record.present}</TableCell>
                      <TableCell className="text-center">{record.absent}</TableCell>
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