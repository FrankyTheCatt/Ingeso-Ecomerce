import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './producto.entity';
import { Pedido } from './pedido.entity';

@Entity('detallePedidos')
export class DetallePedido
{
    @PrimaryGeneratedColumn()
    idDetalle: number;

    @Column()
    cantidad: number;

    @Column()
    precio: number;

    @ManyToOne(() => Pedido, (pedido) => pedido.detalles, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idPedido' })
    pedido: Pedido;

    @OneToMany(() => Producto, (producto) => producto.detalle, { nullable: false, onDelete: 'CASCADE' })
    producto: Producto[];
}