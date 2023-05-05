import { Test } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum'
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService)

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333/')
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'user@example.com',
      password: 'asd123',
    };

    describe('Signup', () => {
      it('Should throw if email is empty', () => {
        return pactum.spec().post('auth/signup',).withBody({
          password: dto.password
        }).expectStatus(400)
      });

      it('Should throw if password is empty', () => {
        return pactum.spec().post('auth/signup',).withBody({
          email: dto.email
        }).expectStatus(400)
      });

      it('Should throw if body is empty', () => {
        return pactum.spec().post('auth/signup',).expectStatus(400)
      });

      it('should signup', () => {
        return pactum.spec().post('auth/signup',).withBody(dto).expectStatus(201)
      })
    });

    it('Should throw if email is taken', () => {
      return pactum.spec().post('auth/signup',).withBody(dto).expectStatus(403)
    });

    describe('Signin', () => {
      it('Should throw if email is empty', () => {
        return pactum.spec().post('auth/signin',).withBody({
          password: dto.password
        }).expectStatus(400)
      });

      it('Should throw if password is empty', () => {
        return pactum.spec().post('auth/signin',).withBody({
          email: dto.email
        }).expectStatus(400)
      });

      it('Should throw if body is empty', () => {
        return pactum.spec().post('auth/signin',).expectStatus(400)
      });

      it('Should throw if password is incorrect', () => {
        return pactum.spec().post('auth/signin',).withBody({
          email: dto.email,
          password: 'asd12'
        }).expectStatus(403)
      });

      it('should signin', () => {
        return pactum.spec().post('auth/signin',).withBody(dto).expectStatus(200).stores('userAt', 'access_token')
      })
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get me current user', () => {
        return pactum.spec().get('users/me',).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).expectStatus(200)
      })
    });

    describe('Edit User', () => {
      it('Should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Nico',
          email: 'editeduser@example.com'
        };

        return pactum.spec().patch('users',).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).withBody(dto).expectStatus(200)
      })
    });
  });
});

// describe('Bookmark', () => {
//   describe('Create bookmark', () => { });
//   describe('Get bookmark', () => { });
//   describe('Get bookmark by id', () => { });
//   describe('Edit bookmark by id', () => { });
//   describe('Delete bookmark by id', () => { });
// });

