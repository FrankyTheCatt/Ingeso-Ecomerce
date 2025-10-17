import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { DetallePedido } from './detallepedido.entity';

@Entity('pedidos')
export class Pedido
{
    @PrimaryGeneratedColumn()
    idPedido: number;

    @Column()
    fechaPedido: Date;

    @Column()
    total: number;

    @Column()
    estado: string;

    @ManyToOne(() => Usuario, (usuario) => usuario.pedidos, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idUsuario' })
    usuario: Usuario;
    
    @OneToMany(() => DetallePedido, (detalle) => detalle.pedido)
    detalles: DetallePedido[];
}