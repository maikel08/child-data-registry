import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Student } from "../StudentForm";

interface AttendanceTableProps {
  workingDays: Date[];
  filteredStudents: Student[];
  attendanceData: Record<string, Record<string, boolean>>;
  isEditing: boolean;
  handleAttendanceChange: (studentId: string, date: Date, checked: boolean) => void;
}

export const AttendanceTable = ({
  workingDays,
  filteredStudents,
  attendanceData,
  isEditing,
  handleAttendanceChange,
}: AttendanceTableProps) => {
  return (
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
  );
};