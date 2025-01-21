import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Student } from "./StudentForm";
import { toast } from "sonner";

// Importamos la misma lista de grupos que se usa en StudentForm
const GROUPS = [
  "Grupo A",
  "Grupo B",
  "Grupo C",
  "Grupo D",
];

interface AttendanceControlProps {
  students: Student[];
}

export const AttendanceControl = ({ students }: AttendanceControlProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedGroup, setSelectedGroup] = useState("");
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const filteredStudents = students.filter((s) => s.group === selectedGroup);

  const handleAttendanceChange = (studentId: string, checked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: checked,
    }));
  };

  const handleSaveAttendance = () => {
    // Aquí se implementaría la lógica para guardar la asistencia
    console.log({
      date: format(date, "yyyy-MM-dd"),
      group: selectedGroup,
      attendance,
    });
    toast.success("Asistencia registrada exitosamente");
    setAttendance({});
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Control de Asistencia</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Seleccionar Fecha</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
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
          <h3 className="text-lg font-semibold mb-4">Lista de Estudiantes - {selectedGroup}</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Asistencia</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellidos</TableHead>
                  <TableHead>Identificación</TableHead>
                  <TableHead>Aula</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        id={student.id}
                        checked={attendance[student.id] || false}
                        onCheckedChange={(checked) =>
                          handleAttendanceChange(student.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{`${student.lastName1} ${student.lastName2}`}</TableCell>
                    <TableCell>{student.identification}</TableCell>
                    <TableCell>{student.classroom}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={handleSaveAttendance} className="mt-4">
            Guardar Asistencia
          </Button>
        </div>
      )}
    </div>
  );
};