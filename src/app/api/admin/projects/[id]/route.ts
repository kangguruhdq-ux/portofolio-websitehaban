import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { projectSchema } from '@/lib/validators';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json({ success: true, project });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid project payload' },
        { status: 400 }
      );
    }

    // Check slug collision with other project
    const existingSlug = await prisma.project.findFirst({
      where: {
        slug: parsed.data.slug,
        NOT: { id: params.id },
      },
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: `Slug "${parsed.data.slug}" sudah digunakan proyek lain.` },
        { status: 409 }
      );
    }

    const { specifications, ...rest } = parsed.data;
    const updated = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(specifications !== undefined ? { specifications: (specifications as any) ?? undefined } : {}),
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.project.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
