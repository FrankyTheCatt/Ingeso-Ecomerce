import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { DetallePedido } from './detallepedido.entity';
import { Categoria } from './categoria.entity';
import { Inventario } from './inventario.entity';

@Entity('productos')
export class Producto
{
    @PrimaryGeneratedColumn()
    idProducto: number;

    @Column()
    nombreProducto: string;

    @Column()
    marca: string;

    @Column()
    precio: number;

    @OneToMany(() => DetallePedido, (detalle) => detalle.producto)
    detalles: DetallePedido[];

    @ManyToOne(() => Categoria, (categoria) => categoria.productos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idCategoria' })
    categoria: Categoria;

    @OneToMany(() => Inventario, (inventario) => inventario.productos)
    inventarios: Inventario[];
}
