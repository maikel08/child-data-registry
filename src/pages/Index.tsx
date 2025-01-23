import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentForm, type Student } from "@/components/StudentForm";
import { StudentList } from "@/components/StudentList";
import { AttendanceControl } from "@/components/AttendanceControl";
import { AttendanceReport } from "@/components/AttendanceReport";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("last_name1", { ascending: true });

      if (error) throw error;

      if (data) {
        const mappedStudents: Student[] = data.map((student) => ({
          id: student.id,
          firstName: student.first_name,
          lastName1: student.last_name1,
          lastName2: student.last_name2,
          identification: student.identification,
          nationality: student.nationality,
          education: student.education,
          classroom: student.classroom,
          group: student.group,
        }));
        setStudents(mappedStudents);
      }
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      toast.error("Error al cargar la lista de estudiantes");
    }
  };

  const handleStudentSubmit = (student: Student) => {
    setStudents((prev) => [...prev, student]);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Sistema de Gestión Estudiantil</h1>
      
      <Tabs defaultValue="register" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="register">Registro</TabsTrigger>
          <TabsTrigger value="list">Lista de Estudiantes</TabsTrigger>
          <TabsTrigger value="attendance">Control de Asistencia</TabsTrigger>
          <TabsTrigger value="report">Reporte de Asistencia</TabsTrigger>
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

        <TabsContent value="report">
          <AttendanceReport students={students} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;