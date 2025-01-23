import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const GROUPS = ["Grupo A", "Grupo B", "Grupo C", "Grupo D"];

interface MonthlyAttendanceHeaderProps {
  selectedMonth: Date;
  setSelectedMonth: (date: Date | undefined) => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
}

export const MonthlyAttendanceHeader = ({
  selectedMonth,
  setSelectedMonth,
  selectedGroup,
  setSelectedGroup,
}: MonthlyAttendanceHeaderProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Lista de Asistencia Mensual</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Seleccionar Mes</h3>
          <Calendar
            mode="single"
            selected={selectedMonth}
            onSelect={setSelectedMonth}
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
    </div>
  );
};