import { describe, expect, it } from 'vitest';
import {
  getProjectedBalanceAfterEdit,
  getSignedTransactionAmount,
  hasSufficientBalance,
  normalizeStatementEntryType,
  toStatementEntryType,
  toTransactionType,
} from './transaction-rules';
import { StatementEntryType, TransactionType } from './transaction.types';

describe('transaction domain', () => {
  it('converte tipos entre transacao e extrato', () => {
    expect(toStatementEntryType(TransactionType.DEPOSIT)).toBe(StatementEntryType.DEPOSIT);
    expect(toStatementEntryType(TransactionType.TRANSFER)).toBe(StatementEntryType.TRANSFER);
    expect(toTransactionType(StatementEntryType.DEPOSIT)).toBe(TransactionType.DEPOSIT);
    expect(toTransactionType(StatementEntryType.TRANSFER)).toBe(TransactionType.TRANSFER);
  });

  it('normaliza valores legados do tipo de lancamento', () => {
    expect(normalizeStatementEntryType('Transferencia')).toBe(StatementEntryType.TRANSFER);
    expect(normalizeStatementEntryType('tipo-desconhecido')).toBe(StatementEntryType.DEPOSIT);
  });

  it('aplica sinal positivo para deposito e negativo para transferencia', () => {
    expect(getSignedTransactionAmount(TransactionType.DEPOSIT, -1500)).toBe(1500);
    expect(getSignedTransactionAmount(TransactionType.TRANSFER, 1500)).toBe(-1500);
    expect(getSignedTransactionAmount(StatementEntryType.TRANSFER, -1500)).toBe(-1500);
  });

  it('calcula o saldo projetado ao substituir um lancamento', () => {
    expect(getProjectedBalanceAfterEdit(10_000, 2_000, TransactionType.TRANSFER, 3_000)).toBe(
      5_000
    );
  });

  it('verifica saldo sem conhecer componentes ou persistencia', () => {
    expect(hasSufficientBalance(10_000, -10_000)).toBe(true);
    expect(hasSufficientBalance(10_000, -10_001)).toBe(false);
  });
});
