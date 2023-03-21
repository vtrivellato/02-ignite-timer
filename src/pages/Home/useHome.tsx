import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInSeconds } from 'date-fns'

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe uma tarefa'),
    minutesAmount: zod.number().min(1).max(60),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function useHome() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPasses, setAmountSecondsPassed] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })

    const handleCreateNewCycle = (data: NewCycleFormData) => {
        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)

        reset()
    }

    const handleInterruptCycle = () => {
        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            }),
        )

        setActiveCycleId(null)

        document.title = `Ignite timer`
    }

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPasses : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        let interval: number

        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(
                    new Date(),
                    activeCycle.startDate,
                )

                if (secondsDifference >= totalSeconds) {
                    setCycles((state) =>
                        state.map((cycle) => {
                            if (cycle.id === activeCycleId) {
                                return { ...cycle, finishedDate: new Date() }
                            } else {
                                return cycle
                            }
                        }),
                    )

                    setAmountSecondsPassed(totalSeconds)
                    clearInterval(interval)
                    return
                }

                setAmountSecondsPassed(secondsDifference)
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds, activeCycleId])

    useEffect(() => {
        if (activeCycle) {
            document.title = `${activeCycle.task} - ${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    const isSubmitDisabled = !watch('task')

    return {
        handleCreateNewCycle,
        handleInterruptCycle,
        isSubmitDisabled,
        activeCycle,
        minutes,
        seconds,
        register,
        handleSubmit,
    }
}
