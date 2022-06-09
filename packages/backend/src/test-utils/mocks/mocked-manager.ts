import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from 'typeorm';

export const createMockedManager = () => createMock<EntityManager>();
