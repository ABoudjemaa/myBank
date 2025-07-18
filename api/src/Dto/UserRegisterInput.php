<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class UserRegisterInput
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 2)]
    public string $firstName;

    #[Assert\NotBlank]
    #[Assert\Length(min: 2)]
    public string $lastName;

    #[Assert\NotBlank]
    #[Assert\Regex(
        pattern: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
        message: 'Veuillez entrer une adresse email valide.'
    )]
    public string $email;


    #[Assert\NotBlank]
    #[Assert\Length(min: 8)]
    public string $password;
}
