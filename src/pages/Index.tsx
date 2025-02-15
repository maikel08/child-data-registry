
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentForm, type Student } from "@/components/StudentForm";
import { StudentList } from "@/components/StudentList";
import { AttendanceControl } from "@/components/AttendanceControl";
import { AttendanceReport } from "@/components/AttendanceReport";
import { MonthlyAttendanceList } from "@/components/MonthlyAttendanceList";
import { AttendanceDashboard } from "@/components/AttendanceDashboard";
import { PsychologicalTests } from "@/components/PsychologicalTests";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState("register");

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <SidebarInset>
          <div className="container py-8">
            <div className="flex items-center mb-8">
              <SidebarTrigger className="md:hidden mr-4 text-white bg-sidebar hover:bg-sidebar-accent p-2 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
              </SidebarTrigger>
              <h1 className="text-3xl font-bold">Sistema de Gestión Estudiantil</h1>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="hidden md:grid w-full grid-cols-7">
                <TabsTrigger value="register">Registro</TabsTrigger>
                <TabsTrigger value="list">Lista de Estudiantes</TabsTrigger>
                <TabsTrigger value="attendance">Control de Asistencia</TabsTrigger>
                <TabsTrigger value="monthly">Lista Mensual</TabsTrigger>
                <TabsTrigger value="report">Reporte de Asistencia</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="psychological">Pruebas Psicológicas</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {activeTab === "register" && (
                  <TabsContent value="register">
                    <StudentForm onSubmit={handleStudentSubmit} />
                  </TabsContent>
                )}

                {activeTab === "list" && (
                  <TabsContent value="list">
                    <StudentList students={students} />
                  </TabsContent>
                )}

                {activeTab === "attendance" && (
                  <TabsContent value="attendance">
                    <AttendanceControl students={students} />
                  </TabsContent>
                )}

                {activeTab === "monthly" && (
                  <TabsContent value="monthly">
                    <MonthlyAttendanceList students={students} />
                  </TabsContent>
                )}

                {activeTab === "report" && (
                  <TabsContent value="report">
                    <AttendanceReport students={students} />
                  </TabsContent>
                )}

                {activeTab === "dashboard" && (
                  <TabsContent value="dashboard">
                    <AttendanceDashboard students={students} />
                  </TabsContent>
                )}

                {activeTab === "psychological" && (
                  <TabsContent value="psychological">
                    <PsychologicalTests students={students} />
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
