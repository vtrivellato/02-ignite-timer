import { differenceInSeconds } from 'date-fns'
import {
    createContext,
    ReactNode,
    useEffect,
    useReducer,
    useState,
} from 'react'
import {
    addNewCycleAction,
    interruptCurrentCycleAction,
    markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (secondes: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({
    children,
}: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(
        cyclesReducer,
        {
            cycles: [],
            activeCycleId: null,
        },
        (initialState) => {
            const storedStateAsJson = localStorage.getItem(
                '@ignite-time:cycles-state-1.0.0',
            )

            if (storedStateAsJson) {
                return JSON.parse(storedStateAsJson)
            }

            return initialState
        },
    )

    const { cycles, activeCycleId } = cyclesState
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(
                new Date(),
                new Date(activeCycle.startDate),
            )
        }

        return 0
    })

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@ignite-time:cycles-state-1.0.0', stateJSON)
    }, [cyclesState])

    const setSecondsPassed = (seconds: number) => {
        setAmountSecondsPassed(seconds)
    }

    const createNewCycle = (data: CreateCycleData) => {
        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle))

        setAmountSecondsPassed(0)
    }

    const markCurrentCycleAsFinished = () => {
        dispatch(markCurrentCycleAsFinishedAction())
    }

    const interruptCurrentCycle = () => {
        dispatch(interruptCurrentCycleAction())

        document.title = `Ignite timer`
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                amountSecondsPassed,
                markCurrentCycleAsFinished,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle,
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}
