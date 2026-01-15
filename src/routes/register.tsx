import { createFileRoute, redirect } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import GenericFormInputs from '@/components/GenericFormInputs'
import { useAuth } from '@/routes/-hooks/useAuth'
import { registerInputs } from '@/routes/-hooks/helpers'

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    const token = localStorage.getItem('token')
    if (token) {
      throw redirect({
        to: '/',
        search: {},
      })
    }
  },
  component: Register,
})

function Register() {
  const { registerForm, submitRegister, registerMutation } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(submitRegister)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {registerInputs.map((input, idx) => (
                <GenericFormInputs
                  key={`${input.name}-${idx}`}
                  {...input}
                  form={registerForm}
                />
              ))}
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}