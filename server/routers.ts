import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { sendNewLeadNotification } from "./email";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  leads: router({
    create: publicProcedure
      .input(z.object({
        nome: z.string().min(1),
        email: z.string().email(),
        telefone: z.string().min(1),
        area: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const lead = await db.createLead(input);
        
        // Enviar notificacao por email
        try {
          await sendNewLeadNotification(input);
        } catch (error) {
          console.error('Erro ao enviar notificacao:', error);
          // Nao interromper o cadastro se o email falhar
        }
        
        return lead;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view leads' });
      }
      return await db.getAllLeads();
    }),

    getById: protectedProcedure
      .input(z.string())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view leads' });
        }
        return await db.getLeadById(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        status: z.enum(['novo', 'contatado', 'interessado', 'matriculado', 'rejeitado']).optional(),
        notas: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can update leads' });
        }
        const { id, ...data } = input;
        return await db.updateLead(id, data);
      }),

    delete: protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can delete leads' });
        }
        return await db.deleteLead(input);
      }),
  }),

  trialClasses: router({
    create: publicProcedure
      .input(z.object({
        nome: z.string().min(1),
        email: z.string().email(),
        telefone: z.string().min(1),
        curso: z.string().min(1),
        area: z.string().min(1),
        dataAgendamento: z.date(),
        horario: z.string().min(1),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createTrialClass(input);
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view trial classes' });
      }
      return await db.getAllTrialClasses();
    }),

    getById: protectedProcedure
      .input(z.string())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view trial classes' });
        }
        return await db.getTrialClassById(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        status: z.enum(['agendado', 'confirmado', 'realizado', 'cancelado']).optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can update trial classes' });
        }
        const { id, ...data } = input;
        return await db.updateTrialClass(id, data);
      }),

    delete: protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can delete trial classes' });
        }
        return await db.deleteTrialClass(input);
      }),
  }),

  feedbacks: router({
    create: publicProcedure
      .input(z.object({
        nome: z.string().min(1),
        email: z.string().email(),
        curso: z.string().min(1),
        avaliacao: z.string().min(1).max(1),
        comentario: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        return await db.createFeedback({
          ...input,
          status: 'pendente',
        });
      }),

    listApproved: publicProcedure.query(async () => {
      return await db.getApprovedFeedbacks();
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view feedbacks' });
      }
      return await db.getAllFeedbacks();
    }),

    getById: protectedProcedure
      .input(z.string())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view feedbacks' });
        }
        return await db.getFeedbackById(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        status: z.enum(['pendente', 'aprovado', 'rejeitado']).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can update feedbacks' });
        }
        const { id, ...data } = input;
        return await db.updateFeedback(id, data);
      }),

    delete: protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can delete feedbacks' });
        }
        return await db.deleteFeedback(input);
      }),
  }),

  curriculos: router({
    create: publicProcedure
      .input(z.object({
        nome: z.string().min(1),
        email: z.string().email(),
        telefone: z.string().min(1),
        area: z.string().min(1),
        nomeArquivo: z.string().min(1),
        caminhoArquivo: z.string().min(1),
        tamanhoArquivo: z.string().min(1),
        tipoArquivo: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        return await db.createCurriculo(input);
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view curriculos' });
      }
      return await db.getAllCurriculos();
    }),

    listByArea: protectedProcedure
      .input(z.string())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view curriculos' });
        }
        return await db.getCurriculosByArea(input);
      }),

    getById: protectedProcedure
      .input(z.string())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view curriculos' });
        }
        return await db.getCurriculoById(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        status: z.enum(['recebido', 'analisando', 'aprovado', 'rejeitado']).optional(),
        notas: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can update curriculos' });
        }
        const { id, ...data } = input;
        return await db.updateCurriculo(id, data);
      }),

    delete: protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can delete curriculos' });
        }
        return await db.deleteCurriculo(input);
      }),
  }),
});



export type AppRouter = typeof appRouter;

