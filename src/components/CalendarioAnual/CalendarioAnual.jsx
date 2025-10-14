import React, { useState, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import styles from './CalendarioAnual.module.css';
import { buscarIntervalosPorAno } from '../../services/locacaoService';

const feriadosFixos = {
  '01-01': 'Ano Novo',
  '21-04': 'Tiradentes',
  '01-05': 'Dia do Trabalhador',
  '07-09': 'Independência',
  '12-10': 'Nossa Senhora Aparecida',
  '02-11': 'Finados',
  '15-11': 'Proclamação da República',
  '25-12': 'Natal'
};

function gerarDiasDoMes(ano, mes) {
  const dias = [];
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  let semana = new Array(primeiroDia).fill(null);
  for (let dia = 1; dia <= totalDias; dia++) {
    semana.push(dia);
    if (semana.length === 7) {
      dias.push(semana);
      semana = [];
    }
  }
  if (semana.length > 0) {
    while (semana.length < 7) semana.push(null);
    dias.push(semana);
  }

  return dias;
}

function gerarDatasLocadas(locacoes) {
  const datas = new Set();

  locacoes.forEach(({ dataInicio, dataFim }) => {
    const inicio = DateTime.fromISO(dataInicio);
    const fim = DateTime.fromISO(dataFim);

    let atual = inicio;
    while (atual <= fim) {
      const dia = String(atual.day).padStart(2, '0');
      const mes = String(atual.month).padStart(2, '0');
      const ano = atual.year;
      datas.add(`${dia}-${mes}-${ano}`);
      atual = atual.plus({ days: 1 });
    }
  });

  return datas;
}

const CalendarioAnual = () => {
  const anoAtual = new Date().getFullYear();
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);
  const [locacoes, setLocacoes] = useState([]);

  useEffect(() => {
  buscarIntervalosPorAno(anoSelecionado)
    .then(res => {
      console.log('Dados recebidos do backend:', res.data);
      setLocacoes(res.data);
    })
    .catch(err => console.error('Erro ao buscar locações:', err));
  }, [anoSelecionado]);

  const datasLocadas = useMemo(() => gerarDatasLocadas(locacoes), [locacoes]);

  const meses = Array.from({ length: 12 }, (_, i) =>
    new Date(anoSelecionado, i).toLocaleString('pt-BR', { month: 'long' })
  );

  return (
    <div className={styles.calendarioAnual}>
      <div className={styles.anoSelectorCard}>
        <label htmlFor="ano" className={styles.labelAno}>Ano:</label>
        <select
          id="ano"
          className={styles.selectAno}
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
        >
          {[anoAtual, anoAtual + 1, anoAtual + 2].map(ano => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>

      {[0, 1].map((linha) => (
        <div key={linha} className={styles.linhaHorizontal}>
          {meses.slice(linha * 6, linha * 6 + 6).map((nomeMes, mesIndex) => {
            const realIndex = linha * 6 + mesIndex;
            return (
              <div key={realIndex} className={styles.mes}>
                <h3 className={styles.tituloMes}>
                  {nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)}
                </h3>
                <table className={styles.tabela}>
                  <thead className={styles.cabecalho}>
                    <tr>
                      <th>Dom</th><th>Seg</th><th>Ter</th>
                      <th>Qua</th><th>Qui</th><th>Sex</th><th>Sáb</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gerarDiasDoMes(anoSelecionado, realIndex).map((semana, i) => (
                      <tr key={i}>
                        {semana.map((dia, j) => {
                          const dataStr = dia
                            ? `${String(dia).padStart(2, '0')}-${String(realIndex + 1).padStart(2, '0')}-${anoSelecionado}`
                            : '';
                          const feriadoKey = dataStr.slice(0, 5);
                          const isFeriado = feriadosFixos[feriadoKey];
                          const isLocado = datasLocadas.has(dataStr);
                          
                          // ✅ Log para teste
                          //if (isLocado) console.log('Locado:', dataStr);

                          const cellClass = [
                            styles.celula,
                            isFeriado ? styles.feriado : '',
                            isLocado ? styles.locado : ''
                          ].filter(Boolean).join(' ');

                          return (
                            <td
                              key={j}
                              className={cellClass}
                              title={isFeriado || (isLocado ? 'Locado' : '')}
                            >
                              {dia || ''}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CalendarioAnual;