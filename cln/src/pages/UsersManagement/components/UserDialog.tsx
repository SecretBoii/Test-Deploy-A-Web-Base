import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Select,
  Button,
  IconButton,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  UserPlus,
  Pencil,
  X,
  Save,
  Key,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Mail,
  GraduationCap,
  Building2,
  BookOpen,
} from 'lucide-react';
import type { User } from '../../../api/users';

export interface UserFormData {
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  roleId: number;
  university?: string;
  faculty?: string;
  major?: string;
}

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  user: User | null;
}

// โครงสร้าง State ภายในฟอร์มเพื่อรวบ State เป็นก้อนเดียว (ลดโค้ดซ้ำซ้อน)
interface FormState {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  roleId: number;
  university: string;
  faculty: string;
  major: string;
}

const initialFormState: FormState = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  gender: 'male',
  dateOfBirth: '',
  roleId: 1,
  university: '',
  faculty: '',
  major: '',
};

// สไตล์มาตรฐานสำหรับ Input และ Select (ความสูง 42px มาตรฐาน Modern SaaS)
const inputSx = {
  borderRadius: '10px',
  bgcolor: '#ffffff',
  height: '42px',
  fontSize: '13.5px',
  color: '#0f172a',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4f46e5',
    borderWidth: '1.5px',
    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.12)',
  },
  '& .MuiInputBase-input': {
    py: 0,
    height: '42px',
    boxSizing: 'border-box',
    fontSize: '13.5px',
    color: '#0f172a',
  },
};

const selectSx = {
  ...inputSx,
  '& .MuiSelect-select': {
    py: 0,
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    fontSize: '13.5px',
    color: '#0f172a',
  },
};

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: ReactNode;
  endAdornment?: ReactNode;
  maxDate?: string;
  autoComplete?: string;
}

function FormField({
  label,
  value,
  onChange,
  required,
  error,
  type = 'text',
  placeholder,
  disabled,
  icon,
  endAdornment,
  maxDate,
  autoComplete = 'off',
}: FormFieldProps) {
  return (
    <Box>
      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.5, display: 'flex', gap: 0.5 }}>
        {label}
        {required && <Box component="span" sx={{ color: '#ef4444' }}>*</Box>}
      </Typography>
      <TextField
        fullWidth
        size="small"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={!!error}
        helperText={error}
        placeholder={placeholder}
        autoComplete={autoComplete}
        slotProps={{
          htmlInput: {
            ...(maxDate ? { max: maxDate } : {}),
            autoComplete,
          },
          input: {
            sx: inputSx,
            startAdornment: icon ? <InputAdornment position="start">{icon}</InputAdornment> : undefined,
            endAdornment,
          },
        }}
      />
    </Box>
  );
}

export function UserDialog({ open, onClose, onSubmit, user }: UserDialogProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ซิงค์ข้อมูลเข้าสู่ Form เมื่อเปิด Dialog หรือเปลี่ยนข้อมูล User
  useEffect(() => {
    if (user) {
      const uni = user.education?.university || '';
      const fac = user.education?.faculty || '';
      const maj = user.education?.major || '';
      setForm({
        username: user.username || '',
        password: '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        gender: user.gender || 'male',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : '',
        roleId: user.roleId || 1,
        university: uni === 'Default University' || uni === 'ไม่ระบุ' ? '' : uni,
        faculty: fac === 'Default Faculty' || fac === 'ไม่ระบุ' || fac === '-' ? '' : fac,
        major: maj === 'Default Major' || maj === 'ไม่ระบุ' || maj === '-' ? '' : maj,
      });
    } else {
      setForm(initialFormState);
    }
    setShowPassword(false);
    setErrors({});
  }, [user, open]);

  // ฟังก์ชันส่วนกลางสำหรับอัปเดตฟิลด์ในฟอร์ม พร้อมล้าง Error ที่เกี่ยวข้อง
  const handleFieldChange = (field: keyof FormState, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ตรวจสอบความถูกต้องของข้อมูล (Validation) ตามกฎระบบ
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.username.trim()) newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
    if (!form.firstName.trim()) newErrors.firstName = 'กรุณากรอกชื่อจริง';
    if (!form.lastName.trim()) newErrors.lastName = 'กรุณากรอกนามสกุล';
    if (!form.email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'กรุณาระบุวันเกิด';

    // กฎการศึกษา: Student บังคับกรอกทั้งหมด / บทบาทอื่นถ้าเริ่มกรอกช่องใดช่องหนึ่ง ต้องกรอกให้ครบ
    if (form.roleId === 1) {
      if (!form.university.trim()) newErrors.university = 'กรุณาระบุมหาวิทยาลัย';
      if (!form.faculty.trim()) newErrors.faculty = 'กรุณาระบุคณะ';
      if (!form.major.trim()) newErrors.major = 'กรุณาระบุสาขาวิชา';
    } else {
      const hasAnyEdu = Boolean(form.university.trim() || form.faculty.trim() || form.major.trim());
      if (hasAnyEdu) {
        if (!form.university.trim()) newErrors.university = 'หากระบุข้อมูลสถานศึกษา กรุณาระบุมหาวิทยาลัยให้ครบถ้วน';
        if (!form.faculty.trim()) newErrors.faculty = 'หากระบุข้อมูลสถานศึกษา กรุณาระบุคณะให้ครบถ้วน';
        if (!form.major.trim()) newErrors.major = 'หากระบุข้อมูลสถานศึกษา กรุณาระบุสาขาวิชาให้ครบถ้วน';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data: UserFormData = {
      username: form.username.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      roleId: form.roleId,
      university: form.university.trim(),
      faculty: form.faculty.trim(),
      major: form.major.trim(),
    };

    if (form.password.trim()) {
      data.password = form.password.trim();
    }

    onSubmit(data);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            maxWidth: '840px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 25px 35px -5px rgba(15, 23, 42, 0.12), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
            overflow: 'hidden',
            bgcolor: '#ffffff',
          },
        },
      }}
    >
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        {/* Header สไตล์มาตรฐานระบบ */}
        <Box sx={{ px: 3, py: 2.25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 42, height: 42, borderRadius: '10px', bgcolor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user ? <Pencil size={20} /> : <UserPlus size={20} />}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '18px', lineHeight: 1.25 }}>
                {user ? `แก้ไขข้อมูลผู้ใช้งาน (#${user.userId})` : 'เพิ่มผู้ใช้งานใหม่'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '12.5px', mt: 0.25, display: 'block' }}>
                {user ? 'ปรับปรุงรายละเอียดบัญชี ข้อมูลส่วนบุคคล และสถานะสังกัดในระบบ' : 'กรอกรายละเอียดบัญชี ข้อมูลส่วนบุคคล และกำหนดสิทธิ์การเข้าใช้งาน'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#94a3b8', borderRadius: '8px', border: '1px solid #e2e8f0', p: 0.8, '&:hover': { color: '#0f172a', bgcolor: '#f1f5f9' } }}>
            <X size={18} />
          </IconButton>
        </Box>

        {/* เนื้อหาฟอร์มแบ่ง 3 หมวดหมู่การ์ด */}
        <DialogContent sx={{ p: { xs: 2.5, sm: 3 }, bgcolor: '#ffffff', display: 'flex', flexDirection: 'column', gap: 2.5, maxHeight: 'calc(90vh - 140px)', overflowY: 'auto' }}>
          
          {/* หมวดที่ 1: ข้อมูลบัญชีและความปลอดภัย */}
          <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: '#eef2ff', color: '#4f46e5', display: 'flex' }}><Key size={16} /></Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>ข้อมูลบัญชีและความปลอดภัย (Account & Security)</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField
                  label="ชื่อผู้ใช้"
                  required
                  value={form.username}
                  onChange={(val) => handleFieldChange('username', val)}
                  disabled={!!user}
                  error={errors.username}
                  placeholder="เช่น student01"
                  icon={<Key size={16} color="#94a3b8" />}
                  autoComplete="off"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField
                  label={user ? 'รหัสผ่านใหม่ (ว่างไว้ถ้าไม่เปลี่ยน)' : "รหัสผ่าน (ค่าเริ่มต้น '1234')"}
                  value={form.password}
                  onChange={(val) => handleFieldChange('password', val)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={user ? 'เว้นว่างไว้หากไม่เปลี่ยน' : 'เว้นว่างไว้จะเป็น 1234'}
                  icon={<Lock size={16} color="#94a3b8" />}
                  autoComplete="new-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end" sx={{ color: '#94a3b8', '&:hover': { color: '#4f46e5' } }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.5, display: 'flex', gap: 0.5 }}>
                    สิทธิ์ผู้ใช้งาน (Role) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <Select
                    fullWidth
                    size="small"
                    value={form.roleId}
                    onChange={(e) => {
                      const newRole = Number(e.target.value);
                      handleFieldChange('roleId', newRole);
                      if (newRole !== 1 && !form.university.trim() && !form.faculty.trim() && !form.major.trim()) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.university;
                          delete next.faculty;
                          delete next.major;
                          return next;
                        });
                      }
                    }}
                    sx={selectSx}
                  >
                    <MenuItem value={1}>Student (ผู้เรียน)</MenuItem>
                    <MenuItem value={2}>Teacher (ผู้สอน)</MenuItem>
                    <MenuItem value={3}>Admin (ผู้ดูแลระบบ)</MenuItem>
                  </Select>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* หมวดที่ 2: ข้อมูลส่วนบุคคล */}
          <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: '#eef2ff', color: '#4f46e5', display: 'flex' }}><UserIcon size={16} /></Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>ข้อมูลส่วนบุคคล (Personal Details)</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField label="ชื่อจริง" required value={form.firstName} onChange={(v) => handleFieldChange('firstName', v)} error={errors.firstName} placeholder="เช่น สมชาย" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField label="นามสกุล" required value={form.lastName} onChange={(v) => handleFieldChange('lastName', v)} error={errors.lastName} placeholder="เช่น ใจดี" />
              </Grid>
              <Grid size={{ xs: 12, sm: 5 }}>
                <FormField label="อีเมล" required value={form.email} onChange={(v) => handleFieldChange('email', v)} type="email" error={errors.email} placeholder="somchai@example.com" icon={<Mail size={16} color="#94a3b8" />} />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.5, display: 'flex', gap: 0.5 }}>
                    เพศ <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <Select fullWidth size="small" value={form.gender} onChange={(e) => handleFieldChange('gender', e.target.value)} sx={selectSx}>
                    <MenuItem value="male">ชาย</MenuItem>
                    <MenuItem value="female">หญิง</MenuItem>
                    <MenuItem value="other">อื่นๆ</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="วันเกิด" required value={form.dateOfBirth} onChange={(v) => handleFieldChange('dateOfBirth', v)} type="date" error={errors.dateOfBirth} maxDate={todayStr} />
              </Grid>
            </Grid>
          </Box>

          {/* หมวดที่ 3: ข้อมูลสถานศึกษา */}
          <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box sx={{ p: 0.6, borderRadius: '8px', bgcolor: '#eef2ff', color: '#4f46e5', display: 'flex' }}><GraduationCap size={16} /></Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>ข้อมูลสถานศึกษา (Education Details)</Typography>
              </Box>
              <Chip
                label={form.roleId === 1 ? 'จำเป็นสำหรับ Student' : 'ไม่บังคับ'}
                size="small"
                sx={{ height: '22px', fontSize: '11px', fontWeight: 500, bgcolor: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="มหาวิทยาลัย" required={form.roleId === 1} value={form.university} onChange={(v) => handleFieldChange('university', v)} error={errors.university} placeholder="เช่น มหาวิทยาลัยสงขลานครินทร์" icon={<Building2 size={16} color="#94a3b8" />} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="คณะ" required={form.roleId === 1} value={form.faculty} onChange={(v) => handleFieldChange('faculty', v)} error={errors.faculty} placeholder="เช่น คณะวิทยาศาสตร์" icon={<BookOpen size={16} color="#94a3b8" />} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="สาขาวิชา" required={form.roleId === 1} value={form.major} onChange={(v) => handleFieldChange('major', v)} error={errors.major} placeholder="เช่น วิทยาการคอมพิวเตอร์" />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* Action Footer */}
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0', bgcolor: '#ffffff', gap: 1.5 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '10px', height: '40px', textTransform: 'none', fontWeight: 600, fontSize: '13px', borderColor: '#cbd5e1', color: '#475569', px: 2.5, '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' } }}>
            ยกเลิก
          </Button>
          <Button type="submit" variant="contained" startIcon={<Save size={16} />} sx={{ borderRadius: '10px', height: '40px', textTransform: 'none', fontWeight: 700, fontSize: '13px', bgcolor: '#4f46e5', color: '#ffffff', px: 3, boxShadow: 'none', '&:hover': { bgcolor: '#4338ca', boxShadow: 'none' }, transition: 'all 0.15s ease' }}>
            {user ? 'บันทึกการแก้ไข' : 'บันทึกผู้ใช้งาน'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
