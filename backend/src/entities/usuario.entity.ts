import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity('usuarios')
export class Usuario 
{
    @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column()
    nombre: string;

    @Column()
    rut: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Pedido, (pedido) => pedido.usuario)
    pedidos: Pedido[];
}