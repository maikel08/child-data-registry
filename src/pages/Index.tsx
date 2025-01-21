import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentForm, type Student } from "@/components/StudentForm";
import { StudentList } from "@/components/StudentList";
import { AttendanceControl } from "@/components/AttendanceControl";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);

  const handleStudentSubmit = (student: Student) => {
    setStudents((prev) => [...prev, student]);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Sistema de Gestión Estudiantil</h1>
      
      <Tabs defaultValue="register" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="register">Registro</TabsTrigger>
          <TabsTrigger value="list">Lista de Estudiantes</TabsTrigger>
          <TabsTrigger value="attendance">Control de Asistencia</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <StudentForm onSubmit={handleStudentSubmit} />
        </TabsContent>

        <TabsContent value="list">
          <StudentList students={students} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceControl students={students} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;