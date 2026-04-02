import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/admin-view-report.css";

function ViewReport() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("KG1");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/students?classLevel=${selectedClass}`)
      .then(res => res.json())
      .then(setStudents);
  }, [selectedClass]);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>View Reports – {selectedClass}</h1>
        <Link to="/admin" className="back-link">← Back</Link>
      </header>
      <div className="class-tabs">
        {["KG1","KG2","KG3"].map(c => <button key={c} className={selectedClass===c?"active":""} onClick={()=>setSelectedClass(c)}>{c}</button>)}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Maths</th><th>English</th><th>Amharic</th><th>Art</th><th>Science</th>
              <th>Suggestions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.grades?.Maths || "-"}</td>
                <td>{s.grades?.English || "-"}</td>
                <td>{s.grades?.Amharic || "-"}</td>
                <td>{s.grades?.Art || "-"}</td>
                <td>{s.grades?.Science || "-"}</td>
                <td>{s.suggestions || "No suggestions"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewReport;