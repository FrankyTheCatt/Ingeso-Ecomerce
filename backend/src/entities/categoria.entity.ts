import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Producto } from './producto.entity';

@Entity('categorias')
export class Categoria
{
    @PrimaryGeneratedColumn()
    idCategoria: number;

    @Column()
    nombreCategoria: string;

    @OneToMany(() => Producto, (producto) => producto.categoria)
    productos: Producto[];

}