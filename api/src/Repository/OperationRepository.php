<?php

namespace App\Repository;

use App\Entity\Operation;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Operation>
 */
class OperationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Operation::class);
    }


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

    public function findOneByIdAndUser(User $user, int $categoryId): ?Operation
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

//    /**
//     * @return Operation[] Returns an array of Operation objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('o.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Operation
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
