/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CarStatus = 'available' | 'reserved' | 'new' | 'sold';

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  gearbox: string;
  engine: string;
  colorExterior: string;
  colorInterior: string;
  drivetrain: string;
  plate: string;
  status: CarStatus;
  images: string[];
  note: string;
}

export interface ContactMessage {
  name: string;
  phone: string;
  email: string;
  message: string;
  carModel?: string;
}
