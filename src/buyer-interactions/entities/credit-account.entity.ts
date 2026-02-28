import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AgreeToAbove {
  YES = 'Yes',
  NO = 'No',
  BOTH = 'Both',
  NONE = 'None',
}

export enum CreditAccountStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

@Entity({ name: 'credit_accounts' })
export class CreditAccount {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'legal_company_name' })
  legalCompanyName: string;

  @Column({ name: 'country_id', type: 'bigint' })
  countryId: number;

  @Column({ name: 'company_established', type: 'bigint' })
  companyEstablished: number;

  @Column({ name: 'number_of_employees' })
  numberOfEmployees: string;

  @Column({ name: 'bank_name' })
  bankName: string;

  @Column({ name: 'bank_address', type: 'text' })
  bankAddress: string;

  @Column({ name: 'bank_contact_name' })
  bankContactName: string;

  @Column({ name: 'bank_email' })
  bankEmail: string;

  @Column({ name: 'company_name_trade_supplier_1' })
  companyNameTradeSupplier1: string;

  @Column({ name: 'address_trade_supplier_1', type: 'text' })
  addressTradeSupplier1: string;

  @Column({ name: 'email_trade_supplier_1' })
  emailTradeSupplier1: string;

  @Column({ name: 'contact_name_trade_supplier_1' })
  contactNameTradeSupplier1: string;

  @Column({ name: 'years_trading_with_trade_supplier_1' })
  yearsTradingWithTradeSupplier1: string;

  @Column({ name: 'company_name_trade_supplier_2' })
  companyNameTradeSupplier2: string;

  @Column({ name: 'address_trade_supplier_2', type: 'text' })
  addressTradeSupplier2: string;

  @Column({ name: 'email_trade_supplier_2' })
  emailTradeSupplier2: string;

  @Column({ name: 'contact_name_trade_supplier_2' })
  contactNameTradeSupplier2: string;

  @Column({ name: 'years_trading_with_trade_supplier_2' })
  yearsTradingWithTradeSupplier2: string;

  @Column({
    name: 'agree_to_above',
    type: 'enum',
    enum: AgreeToAbove,
  })
  agreeToAbove: AgreeToAbove;

  @Column({ name: 'terms_requested', type: 'text' })
  termsRequested: string;

  @Column({ name: 'your_name' })
  yourName: string;

  @Column({ name: 'your_email' })
  yourEmail: string;

  @Column({ name: 'position_in_company' })
  positionInCompany: string;

  @Column({
    type: 'enum',
    enum: CreditAccountStatus,
  })
  status: CreditAccountStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;
}
