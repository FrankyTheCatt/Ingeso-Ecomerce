import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Producto } from './producto.entity';

@Entity('inventarios')
export class Inventario
{
    @PrimaryGeneratedColumn()
    idInventario: number;

    @Column()
    stockDisponible: number;

    @Column()
    stockReservado: number;

    @ManyToOne(() => Producto, (producto) => producto.inventarios, { nullable: false, onDelete: 'CASCADE' })
    productos: Producto;
}