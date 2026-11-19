/**
 * Utilities for Study Materials, Document Structure, and Notes
 * Manages both single-document pipeline ('sb_last_upload') and multi-document library ('sb_materials_library_v1').
 */

export const STORAGE_KEY_UPLOAD = 'sb_last_upload';
export const STORAGE_KEY_SAVED_NOTES = 'sb_saved_notes_v1';
export const STORAGE_KEY_MATERIALS = 'sb_materials_library_v1';

export const ALLOWED_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'txt',
  'rtf',
  'ppt',
  'pptx',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'bmp',
  'svg',
];

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export const ANALYSIS_STEPS = [
  { key: 1, title: 'File Uploaded', activeText: 'Uploading...', doneText: 'Complete', duration: 400 },
  { key: 2, title: 'Reading Document', activeText: 'Parsing text and structure...', doneText: 'Complete', duration: 1100 },
  { key: 3, title: 'Extracting Content', activeText: 'Pulling out key passages...', doneText: 'Complete', duration: 1300 },
  { key: 4, title: 'Identifying Topics', activeText: 'Mapping topics and themes...', doneText: 'Complete', duration: 1200 },
  { key: 5, title: 'Analyzing Concepts', activeText: 'Building concept relationships...', doneText: 'Complete', duration: 1400 },
];

export function getFileExtension(filename) {
  if (!filename || typeof filename !== 'string') return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

export function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function detectSubjectFromFileName(fileName = '') {
  const f = fileName.toLowerCase();
  if (f.includes('phys') || f.includes('newton') || f.includes('grav') || f.includes('mech') || f.includes('force')) return 'Physics';
  if (f.includes('bio') || f.includes('cell') || f.includes('gene') || f.includes('organ') || f.includes('respir')) return 'Biology';
  if (f.includes('math') || f.includes('calc') || f.includes('alg') || f.includes('geom') || f.includes('deriv')) return 'Mathematics';
  if (f.includes('code') || f.includes('cs') || f.includes('prog') || f.includes('py') || f.includes('pointer') || f.includes('algo')) return 'Computer Science';
  if (f.includes('chem') || f.includes('atom') || f.includes('molec') || f.includes('react')) return 'Chemistry';
  if (f.includes('psych') || f.includes('cog') || f.includes('brain') || f.includes('mind')) return 'Psychology';
  if (f.includes('hist') || f.includes('war') || f.includes('civil') || f.includes('revol')) return 'History';
  return 'General Studies';
}

export function validateUploadFile(file) {
  if (!file) {
    return { valid: false, error: 'Please choose a file to upload.' };
  }
  const ext = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: 'Unsupported file type. Supported formats: PDF, DOCX, TXT, PPT, and Images.',
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File is too large. Please select a document under 25MB.',
    };
  }
  return { valid: true };
}

// Default initial course materials
const DEFAULT_MATERIALS = [
  {
    id: 'mat_newtonian_mechanics',
    fileName: 'Physics_Newtonian_Mechanics_Lecture.pdf',
    subject: 'Physics',
    fileSize: 2450000,
    fileSizeLabel: '2.4 MB',
    fileExt: 'pdf',
    uploadedAt: '2024-10-24T10:00:00.000Z',
    topics: ['Law of Inertia', 'Dynamics (F = ma)', 'Action & Reaction', 'Momentum Conservation', 'Friction & Inclined Planes'],
    structure: [
      {
        heading: '1. Fundamentals of Classical Dynamics & Inertia',
        points: [
          "Newton's First Law posits that a body preserves its state of rest or uniform motion in a straight line unless acted on by external net force.",
          "Inertial frames of reference are reference frames where Newton's laws hold without pseudo-forces.",
          "Mass serves as the quantitative measure of an object's resistance to acceleration (inertia).",
        ],
      },
      {
        heading: '2. Second Law of Dynamics & Force Equilibrium',
        points: [
          'Net force acting on a body equals the time rate of change of its linear momentum: F = dp/dt = ma.',
          'Free-body diagrams must resolve all normal, frictional, gravitational, and applied forces into orthogonal components.',
          'Terminal velocity occurs when downward gravitational force equals the upward drag resistance force.',
        ],
      },
      {
        heading: '3. Action-Reaction Pairs & Momentum Conservation',
        points: [
          'Third Law establishes that forces always exist in matched action-reaction pairs acting on different interacting bodies.',
          'Isolated systems conserve total linear momentum during both elastic and inelastic collisions.',
          'Impulse is defined as the integral of force over time (J = Δp = F_avg · Δt).',
        ],
      },
      {
        heading: '4. Summary & High-Yield Exam Review',
        points: [
          'Core Formulas: F = ma, p = mv, F_friction ≤ μ_s · F_N, a_c = v² / r.',
          'Key Pitfall: Action and reaction forces never cancel each other because they act on separate bodies.',
        ],
      },
    ],
  },
  {
    id: 'mat_cellular_respiration',
    fileName: 'Cellular_Biology_Chapter_4.docx',
    subject: 'Biology',
    fileSize: 1840000,
    fileSizeLabel: '1.8 MB',
    fileExt: 'docx',
    uploadedAt: '2024-10-22T14:30:00.000Z',
    topics: ['Glycolysis Pathway', 'Pyruvate Oxidation', 'Krebs Citric Acid Cycle', 'Electron Transport Chain', 'ATP Synthase'],
    structure: [
      {
        heading: '1. Overview of Cellular Bioenergetics',
        points: [
          'Cellular respiration converts biochemical energy from glucose into adenosine triphosphate (ATP).',
          'Equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~30-32 ATP.',
          'Four major stages: Glycolysis, Pyruvate Oxidation, Citric Acid Cycle, and Oxidative Phosphorylation.',
        ],
      },
      {
        heading: '2. Glycolysis & The Cytosolic Phase',
        points: [
          'Occurs in the cytoplasm under both aerobic and anaerobic conditions without direct oxygen requirement.',
          '1 Glucose molecule is cleaved into 2 Pyruvate molecules, yielding net 2 ATP and 2 NADH.',
          'Phosphofructokinase serves as the primary allosteric rate-limiting enzyme.',
        ],
      },
      {
        heading: '3. The Mitochondrial Matrix & Citric Acid Cycle',
        points: [
          'Pyruvate dehydrogenase complex decarboxylates pyruvate into Acetyl-CoA within the mitochondrial matrix.',
          'Each turn of the Krebs cycle produces 3 NADH, 1 FADH₂, 1 GTP/ATP, and releases 2 CO₂.',
          'Oxaloacetate combines with Acetyl-CoA to regenerate citrate in cyclic progression.',
        ],
      },
      {
        heading: '4. Oxidative Phosphorylation & ATP Synthase',
        points: [
          'Complexes I-IV in the inner mitochondrial membrane pump protons into the intermembrane space creating a proton gradient.',
          'Chemiosmosis drives ATP synthase rotary motor to phosphorylate ADP into ATP.',
          'Oxygen acts as the terminal electron acceptor, forming metabolic water (H₂O).',
        ],
      },
    ],
  },
  {
    id: 'mat_memory_pointers',
    fileName: 'Computer_Science_Memory_Pointers.pdf',
    subject: 'Computer Science',
    fileSize: 980000,
    fileSizeLabel: '980 KB',
    fileExt: 'pdf',
    uploadedAt: '2024-10-18T09:15:00.000Z',
    topics: ['Stack vs Heap', 'Pointer Dereferencing', 'Pointer Arithmetic', 'Dynamic Allocation', 'Memory Leaks & Valgrind'],
    structure: [
      {
        heading: '1. Memory Architecture & Address Space',
        points: [
          'Process address space contains text segment, initialized data, BSS, heap (growing upwards), and stack (growing downwards).',
          'Stack variables are scoped and automatically reclaimed at function return.',
          'Heap allocation provides persistent manual memory lifetimes across function frames.',
        ],
      },
      {
        heading: '2. Pointer Operations & Syntax',
        points: [
          'Address-of operator (&) extracts byte address; dereference operator (*) accesses the referenced value.',
          'Pointer arithmetic automatically scales offsets by the sizeof() the underlying data type.',
          'Array identifiers evaluate as constant pointers to their zeroth element.',
        ],
      },
      {
        heading: '3. Dynamic Memory Allocation Functions',
        points: [
          'malloc() allocates uninitialized memory blocks; calloc() allocates zero-initialized blocks.',
          'realloc() resizes existing contiguous heap allocations or moves them when necessary.',
          'Every allocated block must be paired with exactly one free() call to avoid double-free errors.',
        ],
      },
      {
        heading: '4. Common Pitfalls & Defensive Programming',
        points: [
          'Dangling pointers: referencing memory after free() has released it.',
          'Buffer overflows: writing beyond allocated bounds causing undefined behavior.',
          'Set pointers to NULL immediately following free() to avoid accidental reuse.',
        ],
      },
    ],
  },
];

/**
 * Retrieve all materials in the library.
 * Seeds defaults if storage is empty.
 */
export function getAllMaterials() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MATERIALS);
    let list = raw ? JSON.parse(raw) : null;

    if (!Array.isArray(list) || list.length === 0) {
      list = [...DEFAULT_MATERIALS];

      // If there is an existing single upload that is distinct, include it
      const last = loadLastUpload();
      if (last && last.fileName && !list.some((m) => m.fileName === last.fileName)) {
        list.unshift({
          id: 'mat_' + Date.now(),
          ...last,
          subject: last.subject || detectSubjectFromFileName(last.fileName),
        });
      }

      localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(list));
    }

    return list;
  } catch (err) {
    console.warn('Failed to get all materials', err);
    return DEFAULT_MATERIALS;
  }
}

/**
 * Get a specific material by id
 */
export function getMaterialById(id) {
  const materials = getAllMaterials();
  return materials.find((m) => m.id === id) || null;
}

/**
 * Save or update a material in library and set as active upload
 */
export function saveMaterial(materialRecord) {
  try {
    const materials = getAllMaterials();
    const idx = materials.findIndex((m) => m.id === materialRecord.id || m.fileName === materialRecord.fileName);

    const recordToSave = {
      id: materialRecord.id || 'mat_' + Date.now(),
      subject: materialRecord.subject || detectSubjectFromFileName(materialRecord.fileName),
      ...materialRecord,
    };

    let updated;
    if (idx >= 0) {
      updated = [...materials];
      updated[idx] = { ...updated[idx], ...recordToSave };
    } else {
      updated = [recordToSave, ...materials];
    }

    localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(updated));
    saveLastUpload(recordToSave);
    return recordToSave;
  } catch (err) {
    console.error('Failed to save material', err);
    return null;
  }
}

/**
 * Delete a material from library
 */
export function deleteMaterial(id) {
  try {
    const materials = getAllMaterials();
    const filtered = materials.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(filtered));

    // Update active upload
    const currentActive = loadLastUpload();
    if (currentActive && (currentActive.id === id || currentActive.fileName === id)) {
      if (filtered.length > 0) {
        saveLastUpload(filtered[0]);
      } else {
        clearLastUpload();
      }
    }
    return filtered;
  } catch (err) {
    console.error('Failed to delete material', err);
    return getAllMaterials();
  }
}

/**
 * Update the study notes / structure of a specific material
 */
export function updateMaterialNotes(materialId, structure) {
  try {
    const materials = getAllMaterials();
    const idx = materials.findIndex((m) => m.id === materialId);
    if (idx >= 0) {
      const updated = [...materials];
      updated[idx] = {
        ...updated[idx],
        structure,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(updated));

      const active = loadLastUpload();
      if (active && active.id === materialId) {
        saveLastUpload(updated[idx]);
      }
      return updated[idx];
    }
  } catch (err) {
    console.error('Failed to update material notes', err);
  }
  return null;
}

/**
 * Set an active material for review / notes / structure
 */
export function setActiveMaterial(id) {
  const material = getMaterialById(id);
  if (material) {
    saveLastUpload(material);
    return material;
  }
  return null;
}

export function loadLastUpload() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_UPLOAD);
    if (raw) return JSON.parse(raw);

    // If no last upload, default to the first available in library
    const materials = getAllMaterials();
    if (materials.length > 0) {
      saveLastUpload(materials[0]);
      return materials[0];
    }
    return null;
  } catch (err) {
    console.warn('Failed to load last upload from localStorage', err);
    return null;
  }
}

export function saveLastUpload(data) {
  try {
    localStorage.setItem(STORAGE_KEY_UPLOAD, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Failed to save last upload to localStorage', err);
    return false;
  }
}

export function clearLastUpload() {
  try {
    localStorage.removeItem(STORAGE_KEY_UPLOAD);
  } catch (err) {
    console.warn('Failed to clear last upload', err);
  }
}

/**
 * Generates structured study topics & outline for an uploaded document
 */
export function generateDocumentStructure(fileName, fileExt) {
  const isCode = ['c', 'cpp', 'py', 'js', 'java'].includes(fileExt) || fileName.toLowerCase().includes('programming') || fileName.toLowerCase().includes('code') || fileName.toLowerCase().includes('cs');
  const isBio = fileName.toLowerCase().includes('bio') || fileName.toLowerCase().includes('cell') || fileName.toLowerCase().includes('respir');
  const isMath = fileName.toLowerCase().includes('math') || fileName.toLowerCase().includes('calculus');

  if (isCode) {
    return {
      topics: ['Memory Management', 'Pointers & Addresses', 'Dynamic Allocation', 'Arrays & Pointer Arithmetic', 'Best Practices'],
      structure: [
        {
          heading: '1. Memory Concepts & Fundamentals',
          points: [
            'Understanding stack vs. heap allocation and runtime memory layout',
            'Role of memory addresses and direct memory dereferencing',
            'Pointer variable declaration and initialization patterns',
          ],
        },
        {
          heading: '2. Pointer Operations & Arithmetic',
          points: [
            'Address-of operator (&) and dereference operator (*)',
            'Incrementing pointers through contiguous array elements',
            'Array names as constant pointers to first element',
          ],
        },
        {
          heading: '3. Dynamic Memory Allocation',
          points: [
            'Standard functions: malloc(), calloc(), realloc(), and free()',
            'Checking for NULL allocation returns and avoiding dangling pointers',
            'Preventing memory leaks through timely deallocation',
          ],
        },
        {
          heading: '4. Summary & Practice Problems',
          points: [
            'Common pointer pitfalls: uninitialized pointers and memory corruption',
            'Suggested coding challenges: implementing dynamic arrays and linked lists',
          ],
        },
      ],
    };
  }

  if (isBio) {
    return {
      topics: ['Cellular Architecture', 'Organelle Functions', 'Energy Production (ATP)', 'Membrane Transport', 'Cell Division'],
      structure: [
        {
          heading: '1. Overview of Cell Theory',
          points: [
            'All organisms are composed of one or more cells',
            'The cell is the structural and functional unit of life',
            'Differences between prokaryotic and eukaryotic cell organizations',
          ],
        },
        {
          heading: '2. Membrane Structure & Transport',
          points: [
            'Fluid mosaic model and phospholipid bilayer permeability',
            'Passive transport: simple diffusion, facilitated diffusion, and osmosis',
            'Active transport mechanisms requiring ATP (sodium-potassium pump)',
          ],
        },
        {
          heading: '3. Energy Transduction: Mitochondria & Chloroplasts',
          points: [
            'Aerobic respiration and ATP synthase machinery',
            'Endosymbiotic hypothesis for organelle origin',
          ],
        },
        {
          heading: '4. Key Takeaways & Review',
          points: [
            'Synthesis of cellular respiration stages (Glycolysis, Krebs cycle, ETC)',
            'Recommended diagrams for exam preparation',
          ],
        },
      ],
    };
  }

  if (isMath) {
    return {
      topics: ['Limits & Continuity', 'Derivatives & Rates of Change', 'Integration Techniques', 'Applications of Calculus', 'Review Theorems'],
      structure: [
        {
          heading: '1. Foundations & Limit Laws',
          points: [
            'Intuitive definition of limits and evaluating indeterminate forms',
            'Continuity at a point and Intermediate Value Theorem (IVT)',
          ],
        },
        {
          heading: '2. Differentiation Rules & Applications',
          points: [
            'Power rule, product rule, quotient rule, and chain rule',
            'Critical points, curve sketching, and Mean Value Theorem (MVT)',
          ],
        },
        {
          heading: '3. Integral Calculus & Accumulation',
          points: [
            'Fundamental Theorem of Calculus (Parts 1 & 2)',
            'Integration by substitution and area between curves',
          ],
        },
        {
          heading: '4. Summary & Practice Problems',
          points: [
            'Standard reference table of derivative and integral formulas',
            'Step-by-step worked problem walkthroughs for exam revision',
          ],
        },
      ],
    };
  }

  // Default general academic structure
  return {
    topics: ['Core Concepts', 'Key Definitions', 'Worked Examples', 'Formulas & Rules', 'Summary Points'],
    structure: [
      {
        heading: '1. Introduction & Overview',
        points: [
          'Primary purpose and foundational context of the material',
          'Key learning objectives and essential prerequisite knowledge',
        ],
      },
      {
        heading: '2. Core Principles & Main Concepts',
        points: [
          'Detailed explanation of central theorem and mechanisms',
          'Worked step-by-step example problem with reasoning',
          'Inter-relationships between primary concepts and external modules',
        ],
      },
      {
        heading: '3. Supporting Details & Methodologies',
        points: [
          'Empirical data points, relevant figures, and key references',
          'Edge cases, exceptions to standard rules, and boundary conditions',
        ],
      },
      {
        heading: '4. Summary, Practice & Review Questions',
        points: [
          'Concise summary of critical takeaways for exam revision',
          'Suggested practice problems with high test likelihood',
        ],
      },
    ],
  };
}

