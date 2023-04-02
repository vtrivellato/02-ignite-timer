import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInSeconds } from 'date-fns'

import { CyclesContext } from '../../contexts/CyclesContext'

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe uma tarefa'),
    minutesAmount: zod.number().min(1).max(60),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function useHome() {
    const {
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        setActiveCycleId,
        createNewCycle,
        interruptCurrentCycle,
        markCurrentCycleAsFinished,
        setSecondsPassed,
    } = useContext(CyclesContext)

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })

    const handleCreateNewCycle = (data: NewCycleFormData) => {
        createNewCycle(data)
        reset()
    }

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

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
                    markCurrentCycleAsFinished()

                    setSecondsPassed(totalSeconds)
                    setActiveCycleId(null)
                    clearInterval(interval)

                    document.title = `Ignite timer`

                    return
                }

                setSecondsPassed(secondsDifference)
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [
        activeCycle,
        totalSeconds,
        activeCycleId,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        setActiveCycleId,
    ])

    useEffect(() => {
        if (activeCycle) {
            document.title = `${activeCycle.task} - ${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    const isSubmitDisabled = !watch('task')

    return {
        handleCreateNewCycle,
        interruptCurrentCycle,
        isSubmitDisabled,
        activeCycle,
        minutes,
        seconds,
        register,
        handleSubmit,
    }
}
