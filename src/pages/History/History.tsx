import { useContext } from 'react'

import { CyclesContext } from '../../contexts/CyclesContext'

import { HistoryContainer, HistoryList, Status } from './styles'

export function History() {
    const { cycles } = useContext(CyclesContext)

    return (
        <HistoryContainer>
            <h1>Meu histórico</h1>

            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Tarefa</th>
                            <th>Duração</th>
                            <th>Início</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Algo</td>
                            <td>20 minutos</td>
                            <td>Há 1 ano</td>
                            <td>
                                <Status statusColor="green">Concluído</Status>
                            </td>
                        </tr>
                        <tr>
                            <td>Algo</td>
                            <td>20 minutos</td>
                            <td>Há 1 ano</td>
                            <td>
                                <Status statusColor="yellow">Concluído</Status>
                            </td>
                        </tr>
                        <tr>
                            <td>Algo</td>
                            <td>20 minutos</td>
                            <td>Há 1 ano</td>
                            <td>
                                <Status statusColor="red">Concluído</Status>
                            </td>
                        </tr>
                        <tr>
                            <td>Algo</td>
                            <td>20 minutos</td>
                            <td>Há 1 ano</td>
                            <td>
                                <Status statusColor="green">Concluído</Status>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    )
}
