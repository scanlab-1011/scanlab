export const mockScanResult = {
  data: {
    id: "f8d27a8a3d14c9c107494830d17683e3b586a95c21f4af622e43f536914a8965",
    type: "file",
    attributes: {
      size: 1457664,
      scan_date: 1747287842,
      file_type: "Executable file",
      extension: "exe",
      detection_stats: {
        malicious: 12,
        suspicious: 3,
        clean: 45,
        total: 60
      },
      threat_info: {
        severity: "medium",
        category: "trojan",
        name: "Win32.Trojan.Generic",
        description: "Generic detection for a potential trojan executable targeting Windows systems."
      },
      file_metadata: {
        name: "setup.exe",
        hash: {
          md5: "b5c88fee45b22412a997d9214427d662",
          sha1: "4f9c4e91df5241e74f193b4764d0c9310fe50a26",
          sha256: "f8d27a8a3d14c9c107494830d17683e3b586a95c21f4af622e43f536914a8965"
        },
        mime_type: "application/x-msdownload",
        created: 1747187842,
        modified: 1747187842
      },
      tags: [
        "executable",
        "windows",
        "suspicious-behavior",
        "network-activity",
        "registry-modification"
      ],
      detection_details: [
        {
          engine: "Engine A",
          category: "malicious",
          result: "Trojan.Win32.Generic.A",
          engine_version: "2.4.1",
          engine_update: "20250514"
        },
        {
          engine: "Engine B",
          category: "malicious",
          result: "Malware.Suspicious.Exe.Gen",
          engine_version: "8.3.4",
          engine_update: "20250515"
        },
        {
          engine: "Engine C",
          category: "clean",
          result: null,
          engine_version: "12.0.55",
          engine_update: "20250515"
        },
        {
          engine: "Engine D",
          category: "suspicious",
          result: "Suspicious.File.Activity",
          engine_version: "5.1.7",
          engine_update: "20250514"
        },
        {
          engine: "Engine E",
          category: "clean",
          result: null,
          engine_version: "2025.5.1",
          engine_update: "20250515"
        },
        {
          engine: "Engine F",
          category: "malicious",
          result: "Gen:Trojan.Heur.FU.imP@auWGJndi",
          engine_version: "25.0.0.26",
          engine_update: "20250515"
        }
      ]
    }
  }
};
