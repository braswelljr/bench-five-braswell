import { KeyboardEvent, useEffect, useState } from 'react'
import clsx from 'clsx'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import Spinner from '~/components/ui/spinner'
import { useStore } from '~/context/useStore'
import { ProductRequestI, ProductSize, ProductType } from '~/types/store'

export default function AddProduct() {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<ProductType>('book')
  const { ADD, isLoading } = useStore()

  interface Inputs {
    id: string
    name: string
    price: number
    type: ProductType
    size: ProductSize
    image: File[]
    description: string
  }

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isSubmitted, isValid }
  } = useForm<Inputs>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { id: uuid(), type: 'book' }
  })

  // submit for login
  const onSubmit: SubmitHandler<Inputs> = async data => {
    const Data = data
    // remove NaN from values from data.size object
    const size = Object.fromEntries(Object.entries(data.size).filter(([_, value]) => !isNaN(value)))

    Data.size = size as ProductSize

    console.log(Data)

    ADD({
      ...Data,
      image: ''
    } as ProductRequestI)
  }

  // load on submit
  useEffect(() => {
    if (isSubmitting && isValid && isLoading) setLoading(true)
    else setLoading(false)
  }, [isLoading, isSubmitting, isValid])

  // quit loader on error
  useEffect(() => {
    if (!isValid || isSubmitted) setLoading(false)
  }, [isSubmitted, isValid])

  useEffect(() => {
    // sync type
    setValue('type', type)
    console.log(getValues('type'))
  }, [type])

  return (
    <main className="">
      <form
        id="add-product-form"
        action="#"
        method="post"
        onSubmit={handleSubmit(onSubmit)}
        className=""
      >
        {/* navigation */}
        <nav className="flex items-center justify-between border-b-2 border-neutral-800 px-6 py-6 md:px-12">
          <h1 className="text-2xl font-bold">Product Add</h1>
          <ul className="flex items-center space-x-4">
            <button
              type="submit"
              className="rounded-sm border-2 border-neutral-800 px-3 py-1.5 font-bold"
              disabled={loading}
            >
              {loading ? <Spinner className="h-3 w-3 text-neutral-800" /> : 'Add'}
            </button>
            <Link to="/" className="rounded border-2 border-neutral-800 px-3 py-1.5 font-bold">
              Cancel
            </Link>
          </ul>
        </nav>
        {/* body */}
        <section className="mx-auto max-w-5xl space-y-5 px-2 py-8 max-lg:mx-5 lg:max-w-5xl">
          {/* id */}
          <div className="grid grid-cols-[10rem,1fr] items-center">
            <label htmlFor="sku" className="block text-sm font-medium text-neutral-800">
              SKU
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="sku"
                className={clsx(
                  'block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm'
                )}
                placeholder="SKU"
                {...register('id', {
                  required: false,
                  value: uuid(),
                  minLength: {
                    value: 3,
                    message: 'SKU must be at least 3 characters'
                  }
                })}
              />
            </div>
          </div>
          {/* name */}
          <div className="grid grid-cols-[10rem,1fr] items-start">
            <label htmlFor="name" className="block pt-3 text-sm font-medium text-neutral-800">
              Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="name"
                autoComplete="off"
                {...register('name', {
                  required: true,
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters'
                  }
                })}
                placeholder="Name"
                className={clsx(
                  'block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm',
                  {
                    'focus:border-primary-400 focus:ring-primary-400 border-neutral-500':
                      !errors.name,
                    'border-red-500 focus:border-red-500 focus:ring-red-500': errors.name
                  }
                )}
              />
              {/* error */}
              {errors.name && (
                <div className="mt-1 text-sm text-red-500">
                  <ul className="ml-6 list-disc">
                    {Object.entries(errors.name).map(([key, value]) => {
                      if (key === 'type') {
                        if (value === 'required') return <li key={value}>Name is required</li>
                        if (value === 'minLength')
                          return <li key={value}>Name must be at least 3 characters.</li>
                      }

                      return null
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* price */}
          <div className="grid grid-cols-[10rem,1fr] items-start">
            <label htmlFor="price" className="block pt-3 text-sm font-medium text-neutral-800">
              Price (USD $)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="price"
                autoComplete="off"
                {...register('price', {
                  required: true,
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'Price must be greater than 0'
                  }
                })}
                placeholder="0.00"
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  // Check if the key pressed is a number or backspace
                  if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace')) {
                    // Check if a fullstop has already been entered
                    if (e.key === '.' && (e.target as HTMLInputElement).value.includes('.')) {
                      e.preventDefault()
                    }
                    // Allow the first fullstop to be entered
                    else if (e.key === '.' && !(e.target as HTMLInputElement).value) {
                      e.preventDefault()
                    }
                  }
                }}
                className={clsx(
                  'block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm',
                  {
                    'focus:border-primary-400 focus:ring-primary-400 border-neutral-500':
                      !errors.price,
                    'border-red-500 focus:border-red-500 focus:ring-red-500': errors.price
                  }
                )}
              />
              {/* error */}
              {errors.price && (
                <div className="mt-1 text-sm text-red-500">
                  <ul className="ml-6 list-disc">
                    {Object.entries(errors.price).map(([key, value]) => {
                      if (key === 'type') {
                        if (value === 'required') return <li key={value}>Price is required</li>
                        if (value === 'minLength')
                          return <li key={value}>Price must be greater than 0.</li>
                      }

                      return null
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* select */}
          <div className="grid grid-cols-[10rem,1fr] items-start">
            <label htmlFor="price" className="block pt-3 text-sm font-medium text-neutral-800">
              Type Switcher
            </label>
            <Select defaultValue={getValues('type')} onValueChange={e => setType(e as ProductType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type of item" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="dvd">DVD</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* type */}
          <div className="border-y border-neutral-800 py-6">
            {type === 'dvd' && (
              <div className="space-y-5">
                {/* size */}
                <div className="grid grid-cols-[10rem,1fr] items-start">
                  <label htmlFor="size" className="block pt-3 text-sm font-medium text-neutral-800">
                    Size (MD)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="size"
                      autoComplete="off"
                      {...register('size.size', {
                        required: true,
                        valueAsNumber: true,
                        validate: value => value > 0,
                        min: {
                          value: 0,
                          message: 'Siz must be greater than 0 mb'
                        }
                      })}
                      placeholder="0.00"
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        // Check if the key pressed is a number or backspace
                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace')) {
                          // Check if a fullstop has already been entered
                          if (e.key === '.' && (e.target as HTMLInputElement).value.includes('.')) {
                            e.preventDefault()
                          }
                          // Allow the first fullstop to be entered
                          else if (e.key === '.' && !(e.target as HTMLInputElement).value) {
                            e.preventDefault()
                          }
                        }
                      }}
                      className={clsx(
                        'block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm',
                        {
                          'focus:border-primary-400 focus:ring-primary-400 border-neutral-500':
                            !errors.size,
                          'border-red-500 focus:border-red-500 focus:ring-red-500': errors.size
                        }
                      )}
                    />
                    {/* error */}
                    {errors.size && (
                      <div className="mt-1 text-sm text-red-500">
                        <ul className="ml-6 list-disc">
                          {Object.entries(errors.size).map(([key, value]) => {
                            if (key === 'type') {
                              if (value === 'required') return <li key={value}>Size is required</li>
                              if (value === 'minLength')
                                return <li key={value}>Size must not be less than 1mb</li>
                            }

                            return null
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* description */}
                <div className="">The size of the DVD in Megabytes(MB).</div>
              </div>
            )}
            {type === 'book' && (
              <div className="space-y-5">
                {/* Weight */}
                <div className="grid grid-cols-[10rem,1fr] items-start">
                  <label
                    htmlFor="weight"
                    className="block pt-3 text-sm font-medium text-neutral-800"
                  >
                    Weight (kg)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="weight"
                      autoComplete="off"
                      {...register('size.weight', {
                        required: true,
                        valueAsNumber: true,
                        validate: value => value > 0,
                        min: {
                          value: 0,
                          message: 'Weight must be greater than 0 mb'
                        }
                      })}
                      placeholder="0.00"
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        // Check if the key pressed is a number or backspace
                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace')) {
                          // Check if a fullstop has already been entered
                          if (e.key === '.' && (e.target as HTMLInputElement).value.includes('.')) {
                            e.preventDefault()
                          }
                          // Allow the first fullstop to be entered
                          else if (e.key === '.' && !(e.target as HTMLInputElement).value) {
                            e.preventDefault()
                          }
                        }
                      }}
                      className={clsx(
                        'block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm',
                        {
                          'focus:border-primary-400 focus:ring-primary-400 border-neutral-500':
                            !errors.size,
                          'border-red-500 focus:border-red-500 focus:ring-red-500': errors.size
                        }
                      )}
                    />
                    {/* error */}
                    {errors.size && (
                      <div className="mt-1 text-sm text-red-500">
                        <ul className="ml-6 list-disc">
                          {Object.entries(errors.size).map(([key, value]) => {
                            if (key === 'type') {
                              if (value === 'required')
                                return <li key={value}>Weight is required</li>
                              if (value === 'minLength')
                                return <li key={value}>Weight must not be less than 1mb</li>
                            }

                            return null
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Publisher */}
                <div className="">The Weight of the book is in Kilograms(kg).</div>
              </div>
            )}
            {type === 'furniture' && (
              <div className="space-y-5">
                {/* Height */}
                <div className="grid grid-cols-[10rem,1fr] items-start">
                  <label
                    htmlFor="height"
                    className="block pt-3 text-sm font-medium text-neutral-800"
                  >
                    Height (cm)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="height"
                      autoComplete="off"
                      {...register('size.height', {
                        required: true,
                        valueAsNumber: true,
                        validate: value => value > 0,
                        min: {
                          value: 0,
                          message: 'Height must be greater than 0 mb'
                        }
                      })}
                      placeholder="0.00"
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        // Check if the key pressed is a number or backspace
                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace')) {
                          // Check if a fullstop has already been entered
                          if (e.key === '.' && (e.target as HTMLInputElement).value.includes('.')) {
                            e.preventDefault()
                          }
                          // Allow the first fullstop to be entered
                          else if (e.key === '.' && !(e.target as HTMLInputElement).value) {
                            e.preventDefault()
                          }
                        }
                      }}
                      className={clsx(
                        'block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm',
                        {
                          'focus:border-primary-400 focus:ring-primary-400 border-neutral-500':
                            !errors.size,
                          'border-red-500 focus:border-red-500 focus:ring-red-500': errors.size
                        }
                      )}
                    />
                    {/* error */}
                    {errors.size && (
                      <div className="mt-1 text-sm text-red-500">
                        <ul className="ml-6 list-disc">
                          {Object.entries(errors.size).map(([key, value]) => {
                            if (key === 'type') {
                              if (value === 'required') return <li key={value}>Size is required</li>
                              if (value === 'minLength')
                                return <li key={value}>Size must not be less than 1mb</li>
                            }

                            return null
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* width */}
                <div className="grid grid-cols-[10rem,1fr] items-start">
                  <label
                    htmlFor="width"
                    className="block pt-3 text-sm font-medium text-neutral-800"
                  >
                    Width (cm)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="width"
                      autoComplete="off"
                      {...register('size.width', {
                        required: true,
                        valueAsNumber: true,
                        validate: value => value > 0,
                        min: {
                          value: 0,
                          message: 'Width must be greater than 0 mb'
                        }
                      })}
                      placeholder="0.00"
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        // Check if the key pressed is a number or backspace
                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace')) {
                          // Check if a fullstop has already been entered
                          if (e.key === '.' && (e.target as HTMLInputElement).value.includes('.')) {
                            e.preventDefault()
                          }
                          // Allow the first fullstop to be entered
                          else if (e.key === '.' && !(e.target as HTMLInputElement).value) {
                            e.preventDefault()
                          }
                        }
                      }}
                      className={clsx(
                        'block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm',
                        {
                          'focus:border-primary-400 focus:ring-primary-400 border-neutral-500':
                            !errors.size,
                          'border-red-500 focus:border-red-500 focus:ring-red-500': errors.size
                        }
                      )}
                    />
                    {/* error */}
                    {errors.size && (
                      <div className="mt-1 text-sm text-red-500">
                        <ul className="ml-6 list-disc">
                          {Object.entries(errors.size).map(([key, value]) => {
                            if (key === 'type') {
                              if (value === 'required') return <li key={value}>Size is required</li>
                              if (value === 'minLength')
                                return <li key={value}>Size must not be less than 1mb</li>
                            }

                            return null
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lenght */}
                <div className="grid grid-cols-[10rem,1fr] items-start">
                  <label
                    htmlFor="length"
                    className="block pt-3 text-sm font-medium text-neutral-800"
                  >
                    Lenght (cm)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="length"
                      autoComplete="off"
                      {...register('size.length', {
                        required: true,
                        valueAsNumber: true,
                        validate: value => value > 0,
                        min: {
                          value: 0,
                          message: 'Length must be greater than 0 mb'
                        }
                      })}
                      placeholder="0.00"
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        // Check if the key pressed is a number or backspace
                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace')) {
                          // Check if a fullstop has already been entered
                          if (e.key === '.' && (e.target as HTMLInputElement).value.includes('.')) {
                            e.preventDefault()
                          }
                          // Allow the first fullstop to be entered
                          else if (e.key === '.' && !(e.target as HTMLInputElement).value) {
                            e.preventDefault()
                          }
                        }
                      }}
                      className={clsx(
                        'block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm',
                        {
                          'focus:border-primary-400 focus:ring-primary-400 border-neutral-500':
                            !errors.size,
                          'border-red-500 focus:border-red-500 focus:ring-red-500': errors.size
                        }
                      )}
                    />
                    {/* error */}
                    {errors.size && (
                      <div className="mt-1 text-sm text-red-500">
                        <ul className="ml-6 list-disc">
                          {Object.entries(errors.size).map(([key, value]) => {
                            if (key === 'type') {
                              if (value === 'required') return <li key={value}>Size is required</li>
                              if (value === 'minLength')
                                return <li key={value}>Size must not be less than 1mb</li>
                            }

                            return null
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* message */}
                <div className="">All dimensions are in centimeters (cm)</div>
              </div>
            )}
          </div>

          {/* description */}
          <div className="grid grid-cols-[10rem,1fr] items-start">
            <label htmlFor="name" className="block pt-3 text-sm font-medium text-neutral-800">
              Description
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="description"
                autoComplete="off"
                {...register('description', {
                  required: true,
                  minLength: {
                    value: 3,
                    message: 'Description must be at least 3 characters'
                  }
                })}
                placeholder="Description"
                className={clsx(
                  'block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm',
                  {
                    'focus:border-primary-400 focus:ring-primary-400 border-neutral-500':
                      !errors.description,
                    'border-red-500 focus:border-red-500 focus:ring-red-500': errors.description
                  }
                )}
              />
              {/* error */}
              {errors.description && (
                <div className="mt-1 text-sm text-red-500">
                  <ul className="ml-6 list-disc">
                    {Object.entries(errors.description).map(([key, value]) => {
                      if (key === 'type') {
                        if (value === 'required')
                          return <li key={value}>Description is required</li>
                        if (value === 'minLength')
                          return <li key={value}>Description must be at least 3 characters.</li>
                      }

                      return null
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="w-full rounded-sm border-2 border-neutral-800 bg-neutral-900 px-3 py-1.5 font-bold text-white"
              disabled={loading}
            >
              {loading ? <Spinner className="h-3 w-3" /> : 'Add'}
            </button>
          </div>
        </section>
      </form>
    </main>
  )
}
