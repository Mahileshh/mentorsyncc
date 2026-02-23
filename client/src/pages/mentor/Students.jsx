import { useEffect, useState } from "react";
import {
  Typography,
  Table, TableHead, TableRow,
  TableCell, TableBody, Paper
} from "@mui/material";
import api from "../../services/api";

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await api.get("/mentorstudents");
      setStudents(res.data);
    };
    fetchStudents();
  }, []);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        My Students
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Department</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.year}</TableCell>
                <TableCell>{s.department}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
