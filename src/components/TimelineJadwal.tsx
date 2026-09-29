import React, { useState } from 'react';
import { TimelineItem, JadwalItem } from '../types';
import { gasService } from '../services/gasService';
import { formatTanggalIndonesia } from '../utils/qrUtils';
import { Calendar, Clock, MapPin, User, FileText, ExternalLink, Milestone } from 'lucide-react';

interface TimelineJadwalProps {
  onNavigateToAsesmen?: () => void;
}

export const TimelineJadwal: React.FC<TimelineJadwalProps> = ({ onNavigateToAsesmen }) => {
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'jadwal'>('timeline');
  const timeline = gasService.getTimeline();
  const jadwal = gasService.getJadwal();

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#001c3c] via-[#004c80] to-[#0070b3] rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg border-b-4 border-[#ffc72c] mb-5 sm:mb-6">
        <div className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#ffc72c] mb-1">
          Program Pendampingan UMKM &middot; Gekrafs Kota Batu
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
          Timeline & Jadwal Pelatihan
        </h1>
        <p className="mt-2 text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl">
          Pantau tahapan program akselerasi dan jadwal sesi pelatihan mingguan setiap hari Sabtu.
        </p>

        {onNavigateToAsesmen && (
          <div className="mt-4">
            <button
              onClick={onNavigateToAsesmen}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/30 text-xs font-bold text-white transition-colors"
            >
              <span>📝 Lanjut ke Asesmen Mandiri Peserta</span>
            </button>
          </div>
        )}
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex p-1 bg-white rounded-xl shadow-sm border border-slate-200 mb-5 sm:mb-6">
        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
            activeSubTab === 'timeline'
              ? 'bg-[#001c3c] text-white shadow'
              : 'text-slate-600 hover:text-slate-900 active:bg-slate-100'
          }`}
        >
          <Milestone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Timeline Program</span>
        </button>

        <button
          onClick={() => setActiveSubTab('jadwal')}
          className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
            activeSubTab === 'jadwal'
              ? 'bg-[#001c3c] text-white shadow'
              : 'text-slate-600 hover:text-slate-900 active:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Jadwal Pelatihan ({jadwal.length})</span>
        </button>
      </div>

      {/* Content: Timeline */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-sm">
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#eaf2fb] before:translate-x-[-1px]">
            {timeline.map((item, idx) => {
              const start = formatTanggalIndonesia(item.tanggalMulai);
              const end = formatTanggalIndonesia(item.tanggalSelesai);
              const dateRange = start && end ? `${start} s.d. ${end}` : start || end;

              return (
                <div key={item.row || idx} className="relative flex items-start gap-4">
                  {/* Step Dot */}
                  <div className="w-10 h-10 rounded-full bg-[#001c3c] text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0 shadow-md ring-4 ring-white z-10">
                    {item.urutan || idx + 1}
                  </div>

                  {/* Body */}
                  <div className="flex-1 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/70 hover:border-[#004c80]/40 transition-colors">
                    <h3 className="font-bold text-base text-[#001c3c]">{item.tahapan}</h3>
                    {dateRange && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#004c80] mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateRange}</span>
                      </div>
                    )}
                    {item.keterangan && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.keterangan}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content: Jadwal Pelatihan */}
      {activeSubTab === 'jadwal' && (
        <div className="space-y-4">
          {jadwal.map((sesi, idx) => (
            <div
              key={sesi.idSesi || idx}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm border-l-4 border-l-[#004c80] hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-md bg-[#eaf2fb] text-[#004c80] font-bold text-xs">
                    Sesi {idx + 1}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-[#004c80]" />
                    <span>{formatTanggalIndonesia(sesi.tanggal)}</span>
                    <span>&middot;</span>
                    <Clock className="w-3.5 h-3.5 text-[#004c80]" />
                    <span>{sesi.waktu}</span>
                  </div>
                </div>

                {sesi.linkMateri && (
                  <a
                    href={sesi.linkMateri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#001c3c] hover:bg-[#004c80] px-3.5 py-1.5 rounded-lg transition-colors w-fit"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Buka Materi Pelatihan</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                )}
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-lg text-[#001c3c]">{sesi.topik}</h3>

                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {sesi.pemateri && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>
                        <strong className="text-slate-900">Pemateri:</strong> {sesi.pemateri}
                      </span>
                    </div>
                  )}
                  {sesi.lokasi && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>
                        <strong className="text-slate-900">Lokasi:</strong> {sesi.lokasi}
                      </span>
                    </div>
                  )}
                </div>

                {sesi.catatan && (
                  <p className="mt-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {sesi.catatan}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
