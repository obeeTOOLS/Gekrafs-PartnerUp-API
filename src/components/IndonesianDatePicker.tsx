import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface IndonesianDatePickerProps {
  value?: string; // Format: 'YYYY-MM-DD'
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const BULAN_INDONESIA = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

// Hari standar kalender Indonesia: Dimulai dari Minggu (Min) dengan warna merah
const HARI_INDONESIA = [
  { short: 'Min', name: 'Minggu', isHoliday: true },
  { short: 'Sen', name: 'Senin', isHoliday: false },
  { short: 'Sel', name: 'Selasa', isHoliday: false },
  { short: 'Rab', name: 'Rabu', isHoliday: false },
  { short: 'Kam', name: 'Kamis', isHoliday: false },
  { short: 'Jum', name: 'Jumat', isHoliday: false },
  { short: 'Sab', name: 'Sabtu', isHoliday: false }
];

export const IndonesianDatePicker: React.FC<IndonesianDatePickerProps> = ({
  value = '',
  onChange,
  placeholder = 'Pilih tanggal...',
  className = '',
  disabled = false,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inisialisasi tahun & bulan dari value atau hari ini
  const initialDate = value ? new Date(value) : new Date();
  const validInitialDate = isNaN(initialDate.getTime()) ? new Date() : initialDate;

  const [viewYear, setViewYear] = useState<number>(validInitialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(validInitialDate.getMonth()); // 0 - 11

  // Update tampilan bulan/tahun jika value dari luar berubah
  useEffect(() => {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          setViewYear(y);
          setViewMonth(m);
        }
      }
    }
  }, [value]);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Format tampilan input: "31/10/2026 (31 Oktober 2026)"
  const formattedDisplay = (() => {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length !== 3) return value;
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    const mIdx = parseInt(m, 10) - 1;
    const namaBulan = BULAN_INDONESIA[mIdx] || m;
    return `${d}/${m}/${y} (${parseInt(d, 10)} ${namaBulan} ${y})`;
  })();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const handleToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setViewYear(y);
    setViewMonth(today.getMonth());
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  // Buat matriks hari dalam bulan
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Minggu
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  // Parsing tanggal terpilih saat ini
  let selectedYear: number | null = null;
  let selectedMonth: number | null = null;
  let selectedDay: number | null = null;

  if (value) {
    const parts = value.split('-');
    if (parts.length === 3) {
      selectedYear = parseInt(parts[0], 10);
      selectedMonth = parseInt(parts[1], 10) - 1;
      selectedDay = parseInt(parts[2], 10);
    }
  }

  // Cek apakah tanggal hari ini
  const today = new Date();
  const isCurrentMonthToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth;
  const todayDate = today.getDate();

  // Daftar tahun untuk selector (2024 s.d 2030)
  const years = Array.from({ length: 9 }, (_, i) => 2024 + i);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field Tampilan Indonesia */}
      <div
        id={id}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full px-3 py-2 text-xs border rounded-lg flex items-center justify-between cursor-pointer select-none transition-all ${
          isOpen ? 'border-[#004c80] ring-2 ring-[#004c80]/20 bg-white' : 'border-slate-300 bg-white hover:border-slate-400'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''} ${className}`}
      >
        <div className="flex-1 truncate font-medium text-slate-800">
          {formattedDisplay ? (
            <span className="text-slate-900 font-semibold">{formattedDisplay}</span>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-2 text-slate-400">
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              title="Hapus tanggal"
              className="p-0.5 hover:text-slate-600 rounded-md hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <CalendarIcon className={`w-4 h-4 ${isOpen ? 'text-[#004c80]' : 'text-slate-500'}`} />
        </div>
      </div>

      {/* Popover Kalender Versi Lokal Indonesia */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 z-50 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Kalender: Bulan & Tahun (Bahasa Indonesia) */}
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              {/* Dropdown Bulan Indonesia */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                className="text-xs font-bold text-[#001c3c] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#004c80] cursor-pointer"
              >
                {BULAN_INDONESIA.map((bulan, idx) => (
                  <option key={bulan} value={idx}>
                    {bulan}
                  </option>
                ))}
              </select>

              {/* Dropdown Tahun */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                className="text-xs font-bold text-[#001c3c] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#004c80] cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Navigasi Bulan */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 active:scale-95 transition-all cursor-pointer"
                title="Bulan sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 active:scale-95 transition-all cursor-pointer"
                title="Bulan berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Baris Nama Hari Standar Indonesia (Min s.d Sab) */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {HARI_INDONESIA.map((hari) => (
              <div
                key={hari.short}
                title={hari.name}
                className={`text-[11px] font-bold py-1 ${
                  hari.isHoliday ? 'text-rose-600' : 'text-slate-600'
                }`}
              >
                {hari.short}
              </div>
            ))}
          </div>

          {/* Matriks Tanggal (Grid 7 Kolom) */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Hari bulan sebelumnya (Muted) */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const dayNum = prevMonthDays - firstDayOfWeek + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="h-8 flex items-center justify-center text-[11px] text-slate-300 font-medium select-none"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Hari dalam bulan aktif */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayOfWeek = (firstDayOfWeek + i) % 7;
              const isSunday = dayOfWeek === 0;

              const isSelected =
                selectedYear === viewYear && selectedMonth === viewMonth && selectedDay === dayNum;
              const isToday = isCurrentMonthToday && todayDate === dayNum;

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-8 w-full rounded-xl flex items-center justify-center text-xs font-semibold transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#001c3c] text-[#ffc72c] font-black shadow-md scale-105'
                      : isToday
                      ? 'border-2 border-[#004c80] text-[#004c80] bg-blue-50/50 font-bold'
                      : isSunday
                      ? 'text-rose-600 hover:bg-rose-50'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer Aksi Kalender Bahasa Indonesia */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-500 hover:text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Hapus
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToday}
                className="text-[#004c80] hover:text-[#001c3c] font-bold px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
