import {restapi} from "./api/restapi";
import {TScoreBoardEl} from "./api/api-types";

export const scoreBoardEl = document.getElementById('score-table')!

export const updateScoreBoard = async () => {
    let resultInnerHTML = ''
    const scoreboard = await restapi.getScoreboard()
    for (let i = 0;i < scoreboard.length;i++) {
        resultInnerHTML += createScoreTableItem(scoreboard[i], i)
    }
    scoreBoardEl.innerHTML = resultInnerHTML
}

const createScoreTableItem = (el: TScoreBoardEl, index: number): string => {
    return `<li class="score-table-item">
        <span class="score-table-item-user">${index+1}. ${el.name}</span>
        <span class="score-table-item-points">${el.score}</span>
    </li>`
}