<?php

namespace App\Repository;

use App\Entity\Category;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Category>
 */
class CategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category::class);
    }

    /**
     * @return Category[] Returns an array of Category objects
     */
    public function findByUser(User $user): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.createdBy = :user')
            ->setParameter('user', $user)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }

    public function findOneByIdAndUser(User $user, int $categoryId): ?Category
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.createdBy = :user')
            ->andWhere('c.id = :id')
            ->setParameter('user', $user)
            ->setParameter('id', $categoryId)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
