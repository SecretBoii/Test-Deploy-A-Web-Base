import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "../../components/Layout/MainLayout";
import StudentSession from "./StudentSession";
import TeacherSession from "./TeacherSession";
import { useAuth } from "../../context/AuthContext";

export function SessionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // รองรับการย้อนกลับสำหรับลิงก์เก่าที่ใช้ ?level=X โดย Redirect ไปยัง /sessions/levelX (เฉพาะนักเรียน)
  useEffect(() => {
    if (user?.roleId === 1) {
      const levelParam = searchParams.get("level");
      if (levelParam) {
        navigate(`/sessions/level${levelParam}`, { replace: true });
      }
    }
  }, [searchParams, navigate, user?.roleId]);

  if (!user) {
    return null;
  }

  return (
    <MainLayout activeItem="Sessions">
      {user.roleId === 2 ? (
        <TeacherSession />
      ) : (
        <StudentSession
          userId={user.userId}
          onSelectLevel={(levelId) => {
            navigate(`/sessions/level${levelId}`);
          }}
        />
      )}
    </MainLayout>
  );
}

export default SessionsPage;
