import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Producto } from './producto.entity';

@Entity('categorias')
export class Categoria
{
    @PrimaryGeneratedColumn()
    idCategoria: number;

    @Column()
    nombreCategoria: string;

    @ManyToOne(() => Producto, (producto) => producto.categorias, { nullable: false, onDelete: 'CASCADE' })
    productos: Producto;

}