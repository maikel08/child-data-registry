import { Button } from "@/components/ui/button";

interface AttendanceActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const AttendanceActions = ({
  isEditing,
  onEdit,
  onCancel,
  onSave,
}: AttendanceActionsProps) => {
  return (
    <div className="space-x-2">
      {!isEditing ? (
        <Button onClick={onEdit}>
          Editar Asistencia
        </Button>
      ) : (
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            Guardar Cambios
          </Button>
        </>
      )}
    </div>
  );
};