import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, InsertLead, trialClasses, InsertTrialClass, feedbacks, InsertFeedback, curriculos, InsertCurriculo } from "../drizzle/schema";
import { ENV } from './_core/env';
import { randomUUID } from 'crypto';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Leads functions
export async function createLead(data: Omit<InsertLead, 'id'>): Promise<InsertLead> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const lead: InsertLead = {
    id: randomUUID(),
    ...data,
  };

  await db.insert(leads).values(lead);
  return lead;
}

export async function getAllLeads() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function getLeadById(id: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateLead(id: string, data: Partial<InsertLead>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(leads).set(data).where(eq(leads.id, id));
  return getLeadById(id);
}

export async function deleteLead(id: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(leads).where(eq(leads.id, id));
  return { success: true };
}

// Trial Classes functions
export async function createTrialClass(data: Omit<InsertTrialClass, 'id'>): Promise<InsertTrialClass> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const trialClass: InsertTrialClass = {
    id: randomUUID(),
    ...data,
  };

  await db.insert(trialClasses).values(trialClass);
  return trialClass;
}

export async function getAllTrialClasses() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(trialClasses).orderBy(desc(trialClasses.createdAt));
}

export async function getTrialClassById(id: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(trialClasses).where(eq(trialClasses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateTrialClass(id: string, data: Partial<InsertTrialClass>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(trialClasses).set(data).where(eq(trialClasses.id, id));
  return getTrialClassById(id);
}

export async function deleteTrialClass(id: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(trialClasses).where(eq(trialClasses.id, id));
  return { success: true };
}

// Feedback functions
export async function createFeedback(data: Omit<InsertFeedback, 'id'>): Promise<InsertFeedback> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const feedback: InsertFeedback = {
    id: randomUUID(),
    ...data,
  };

  await db.insert(feedbacks).values(feedback);
  return feedback;
}

export async function getAllFeedbacks() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt));
}

export async function getApprovedFeedbacks() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(feedbacks).where(eq(feedbacks.status, 'aprovado')).orderBy(desc(feedbacks.createdAt));
}

export async function getFeedbackById(id: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(feedbacks).where(eq(feedbacks.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateFeedback(id: string, data: Partial<InsertFeedback>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(feedbacks).set(data).where(eq(feedbacks.id, id));
  return getFeedbackById(id);
}

export async function deleteFeedback(id: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(feedbacks).where(eq(feedbacks.id, id));
  return { success: true };
}



// Currículo functions
export async function createCurriculo(data: Omit<InsertCurriculo, 'id'>): Promise<InsertCurriculo> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const curriculo: InsertCurriculo = {
    id: randomUUID(),
    ...data,
  };

  await db.insert(curriculos).values(curriculo);
  return curriculo;
}

export async function getAllCurriculos() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(curriculos).orderBy(desc(curriculos.createdAt));
}

export async function getCurriculosByArea(area: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(curriculos).where(eq(curriculos.area, area)).orderBy(desc(curriculos.createdAt));
}

export async function getCurriculoById(id: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(curriculos).where(eq(curriculos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateCurriculo(id: string, data: Partial<InsertCurriculo>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(curriculos).set(data).where(eq(curriculos.id, id));
  return getCurriculoById(id);
}

export async function deleteCurriculo(id: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(curriculos).where(eq(curriculos.id, id));
  return { success: true };
}

