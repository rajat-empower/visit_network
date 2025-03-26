import { useEffect, useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

export type ToastActionElement = React.ReactNode

export type Toast = {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "destructive"
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: Omit<Toast, "id">
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<Toast> & Pick<Toast, "id">
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId: string
    }

interface State {
  toasts: Toast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [
          ...state.toasts,
          { id: generateId(), ...action.toast },
        ].slice(-TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // Cancel any pending removal timeouts
      if (toastTimeouts.has(toastId)) {
        clearTimeout(toastTimeouts.get(toastId))
        toastTimeouts.delete(toastId)
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === "all") {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

export function useToast() {
  const [state, setState] = useState<State>({ toasts: [] })

  const dispatch = (action: Action) => {
    setState((prevState) => reducer(prevState, action))
  }

  const toast = (props: Omit<Toast, "id">) => {
    const id = generateId()

    const update = (props: Partial<Toast>) =>
      dispatch({
        type: actionTypes.UPDATE_TOAST,
        toast: { ...props, id },
      })

    const dismiss = () =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

    dispatch({
      type: actionTypes.ADD_TOAST,
      toast: {
        ...props,
        open: true,
        onOpenChange: (open) => {
          if (!open) {
            dismiss()
          }
        },
      },
    })

    return {
      id,
      dismiss,
      update,
    }
  }

  useEffect(() => {
    const handleDismiss = (toast: Toast) => {
      // Set a timeout to remove the toast after the animation has played
      const timeout = setTimeout(() => {
        dispatch({
          type: actionTypes.REMOVE_TOAST,
          toastId: toast.id,
        })
      }, TOAST_REMOVE_DELAY)

      toastTimeouts.set(toast.id, timeout)
    }

    state.toasts.forEach((toast) => {
      if (toast.open === false && !toastTimeouts.has(toast.id)) {
        handleDismiss(toast)
      }
    })

    return () => {
      toastTimeouts.forEach((timeout) => clearTimeout(timeout))
      toastTimeouts.clear()
    }
  }, [state.toasts])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId: string) =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  }
}