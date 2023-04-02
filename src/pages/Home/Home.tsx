import { HandPalm, Play } from 'phosphor-react'

import { useHome } from './useHome'

import {
    CountdownContainer,
    FormContainer,
    HomeContainer,
    Separator,
    StartCountdownButton,
    StopCountdownButton,
    TaskInput,
    MinutesAmountInput,
} from './styles'

export function Home() {
    const {
        handleCreateNewCycle,
        interruptCurrentCycle,
        isSubmitDisabled,
        activeCycle,
        minutes,
        seconds,
        register,
        handleSubmit,
    } = useHome()

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em </label>
                    <TaskInput
                        id="task"
                        list="task-suggestions"
                        placeholder="Dê um nome para o seu projeto"
                        disabled={!!activeCycle}
                        {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1" />
                        <option value="Projeto 2" />
                        <option value="Projeto 3" />
                        <option value="Banana" />
                    </datalist>

                    <label htmlFor="minutesAmount"> durante </label>
                    <MinutesAmountInput
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        disabled={!!activeCycle}
                        step={5}
                        min={1}
                        max={60}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span> minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                {activeCycle ? (
                    <StopCountdownButton
                        type="button"
                        onClick={interruptCurrentCycle}
                    >
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton
                        type="submit"
                        disabled={isSubmitDisabled}
                    >
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}
