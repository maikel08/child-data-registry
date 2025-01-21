import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Student } from "./StudentForm";

interface StudentListProps {
  students: Student[];
}

export const StudentList = ({ students }: StudentListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Identificación</TableHead>
            <TableHead>Grupo</TableHead>
            <TableHead>Aula</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.firstName}</TableCell>
              <TableCell>{`${student.lastName1} ${student.lastName2}`}</TableCell>
              <TableCell>{student.identification}</TableCell>
              <TableCell>{student.group}</TableCell>
              <TableCell>{student.classroom}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};