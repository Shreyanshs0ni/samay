import { requireUser } from '@/lib/auth/requireUser';
import { parseCategoryInput } from '@/lib/validators/category';
import { deleteCategory, updateCategory } from '@/lib/services/categoryService';
import { toErrorResponse } from '@/lib/utils/errors';
import { ok } from '@/lib/utils/api';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const payload = parseCategoryInput(await req.json());
    const category = await updateCategory(user.id, id, payload);
    return ok(category);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const result = await deleteCategory(user.id, id);
    return ok(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
