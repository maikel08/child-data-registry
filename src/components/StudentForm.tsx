import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export interface Student {
  id: string;
  firstName: string;
  lastName1: string;
  lastName2: string;
  identification: string;
  nationality: string;
  education: string;
  classroom: string;
  group: string;
}

interface StudentFormProps {
  onSubmit: (student: Student) => void;
}

export const StudentForm = ({ onSubmit }: StudentFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName1: "",
    lastName2: "",
    identification: "",
    nationality: "",
    education: "",
    classroom: "",
    group: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student: Student = {
      id: crypto.randomUUID(),
      ...formData,
    };
    onSubmit(student);
    setFormData({
      firstName: "",
      lastName1: "",
      lastName2: "",
      identification: "",
      nationality: "",
      education: "",
      classroom: "",
      group: "",
    });
    toast.success("Estudiante registrado exitosamente");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro de Estudiante</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName1">Primer Apellido</Label>
          <Input
            id="lastName1"
            name="lastName1"
            value={formData.lastName1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName2">Segundo Apellido</Label>
          <Input
            id="lastName2"
            name="lastName2"
            value={formData.lastName2}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="identification">Identificación</Label>
          <Input
            id="identification"
            name="identification"
            value={formData.identification}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nacionalidad</Label>
          <Input
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="education">Escolaridad</Label>
          <Input
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="classroom">Aula</Label>
          <Input
            id="classroom"
            name="classroom"
            value={formData.classroom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="group">Grupo</Label>
          <Input
            id="group"
            name="group"
            value={formData.group}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Registrar Estudiante
      </Button>
    </form>
  );
};