import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Student } from "./StudentForm";

const GROUPS = ["Grupo A", "Grupo B", "Grupo C", "Grupo D"];

interface PsychologicalTestsProps {
  students: Student[];
}

interface TestFile {
  id: string;
  student_id: string;
  file_name: string;
  file_path: string;
  test_date: string;
}

export const PsychologicalTests = ({ students }: PsychologicalTestsProps) => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tests, setTests] = useState<TestFile[]>([]);

  const filteredStudents = students.filter((s) => s.group === selectedGroup);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedStudent || !selectedDate) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    try {
      const fileExt = selectedFile.name.split(".").pop();
      const filePath = `${selectedStudent}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("psychological_tests")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("psychological_tests").insert({
        student_id: selectedStudent,
        file_name: selectedFile.name,
        file_path: filePath,
        test_date: format(selectedDate, "yyyy-MM-dd"),
      });

      if (dbError) throw dbError;

      toast.success("Archivo subido exitosamente");
      fetchTests();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error al subir archivo:", error);
      toast.error("Error al subir archivo");
    }
  };

  const fetchTests = async () => {
    if (!selectedStudent) return;

    try {
      const { data, error } = await supabase
        .from("psychological_tests")
        .select("*")
        .eq("student_id", selectedStudent)
        .order("test_date", { ascending: false });

      if (error) throw error;

      setTests(data || []);
    } catch (error) {
      console.error("Error al cargar pruebas:", error);
      toast.error("Error al cargar pruebas psicológicas");
    }
  };

  const handleViewFile = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("psychological_tests")
        .createSignedUrl(filePath, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error) {
      console.error("Error al abrir archivo:", error);
      toast.error("Error al abrir archivo");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Pruebas Psicológicas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Grupo</label>
          <Select value={selectedGroup} onValueChange={(value) => {
            setSelectedGroup(value);
            setSelectedStudent("");
          }}>
            <SelectTrigger>
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Estudiante</label>
          <Select 
            value={selectedStudent} 
            onValueChange={(value) => {
              setSelectedStudent(value);
              fetchTests();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un estudiante" />
            </SelectTrigger>
            <SelectContent>
              {filteredStudents.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {`${student.lastName1} ${student.lastName2}, ${student.firstName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedStudent && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de la Prueba</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={es}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Archivo PDF</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full"
              />
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile}
                className="w-full mt-2"
              >
                Subir Archivo
              </Button>
            </div>
          </>
        )}
      </div>

      {selectedStudent && tests.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Archivos Subidos</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Nombre del Archivo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>
                      {format(new Date(test.test_date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{test.file_name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => handleViewFile(test.file_path)}
                      >
                        Ver PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};