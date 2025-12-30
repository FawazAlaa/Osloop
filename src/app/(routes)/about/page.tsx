import { Container, Paper, Typography, Divider } from "@mui/material";

export default function AboutPage() {
  return (
 <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          About This Application
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h5" sx={{ mb: 2 }}>
          This application is a task and notes management system designed to help
          users organize their daily work in a clear and efficient way.
        </Typography>
       <Divider/>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Users can create, edit, and delete tasks, assign priorities and
          statuses, switch between table and Kanban views, and manage personal
          notes with ease.
        </Typography>

        <Typography variant="body1">
          The focus of this app is simplicity, productivity, and a smooth user
          experience using modern web technologies.
        </Typography>
      </Paper>
    </Container>
  );
}