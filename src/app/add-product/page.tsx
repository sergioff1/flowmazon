import FormSubmitBtn from '@/components/FormSubmitBtn'
import {prisma} from '@/lib/db/prisma'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'

export const metadata = {
  title: 'Add Product - Flowmazon'
}

const addProduct = async (formData: FormData) => {
  'use server'

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/add-product')
  }


  const name = formData.get('name')?.toString()
  const description = formData.get('description')?.toString()
  const imageUrl = formData.get('imageUrl')?.toString()
  const price = Number(formData.get('price') ?? 0)

  if (!name || !description || !imageUrl || !price) {
    throw Error('Missing required fields')
  }

  await prisma.product.create({
    data:{name, description, imageUrl, price}
  })

  redirect('/')
}

const AddProductPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/add-product')
  }

  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">AddProductPage</h1>
      <form action={addProduct}>
        <input
          name="name"
          required
          placeholder="Name"
          className="input input-bordered mb-3 w-full"
        />
        <textarea
          name="description"
          required
          placeholder="Description"
          className="textarea textarea-bordered mb-3 w-full"
        />
        <input
          name="imageUrl"
          required
          placeholder="Image URL"
          type="url"
          className="input input-bordered mb-3 w-full"
        />
        <input
          name="price"
          required
          placeholder="Price"
          type="number"
          className="input input-bordered mb-3 w-full"
        />
        <FormSubmitBtn className="btn-block">
          Add Product
        </FormSubmitBtn>
      </form>
    </div>
  );
};

export default AddProductPage;
