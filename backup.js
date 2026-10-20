import * as D from './domain.js';
import * as DB from './db.js';
import {now,download,today,copy} from './utils.js';
const KEY='SistemaRH2_lastBackup_v1';
function balances(s){return {totals:D.summary(s).totals,payrolls:s.payrolls.map(p=>({id:p.id,...D.totals(s,p)})),advances:s.advances.map(v=>({id:v.id,remaining:D.advanceBalance(s,v)})),specials:['vacations','thirteenths'].flatMap(table=>s[table].map(x=>({table,id:x.id,paid:D.paid(s,table,x.id),remaining:x.value-D.paid(s,table,x.id)})))};}
export function encode(state){D.validate(state);return JSON.stringify({format:'SistemaRH2_Backup',version:1,generatedAt:now(),state:copy(state),balances:balances(state)},null,2);}
export function inspect(text){if(typeof text!=='string'||text.length>30*1024*1024)throw Error('Arquivo ausente ou maior que30MB.');let data;try{data=JSON.parse(text);}catch{throw Error('Arquivo não é JSON válido.');}if(data?.format!=='SistemaRH2_Backup'||data.version!==1||!Number.isFinite(Date.parse(data.generatedAt)))throw Error('Use um backup da versão2.0; não é compatível com o cofre1.1.');D.validate(data.state);if(JSON.stringify(data.balances)!==JSON.stringify(balances(data.state)))throw Error('Saldos do backup não correspondem aos lançamentos.');return copy(data);}
export function mark(state){try{localStorage.setItem(KEY,JSON.stringify({at:now(),installationId:state.installationId,revision:state.revision}));}catch{}}
export function status(state){let record;try{record=JSON.parse(localStorage.getItem(KEY));}catch{}if(!record||record.installationId!==state.installationId||!Number.isFinite(Date.parse(record.at)))return {at:null,text:'Ainda sem backup desta base. Guarde uma cópia no notebook ou pendrive.',due:true};const changed=record.revision!==state.revision;return {at:record.at,text:changed?'Existem lançamentos posteriores ao último backup. Faça uma nova cópia.':'Última geração: '+new Date(record.at).toLocaleString('pt-BR'),due:changed};}
export async function exportCurrent(){const state=await DB.load(),text=encode(state);download('SistemaRH2-backup-'+today()+'.json',text);mark(state);return text;}
export async function restoreFile(data,expected){D.validate(data.state);return DB.restore(data.state,expected);}
export async function exportRecovery(){download('SistemaRH2-copia-anterior-'+today()+'.json',encode(await DB.recovery()));}
