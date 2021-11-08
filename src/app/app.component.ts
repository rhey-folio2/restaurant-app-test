import { Component, OnInit } from '@angular/core';
import { clone, status, pull, commit, statusMatrix, add, push } from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import LightningFS from '@isomorphic-git/lightning-fs';
import { environment } from 'src/environments/environment';
import { LoadingController } from '@ionic/angular';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private loading: LoadingController) { }

  ngOnInit() {
    this.init();
  }

  async init() {
    const loading = await this.loading.create({
      message: `Loading, please wait...`
    });
    loading.present();
    await this.sync();
    loading.dismiss();
  }

  async sync(){
    const fs = new LightningFS(environment.fs_name);
    const fs_promise = fs.promises;

    const dir = '/test';
    const repo = {
      fs,
      http,
      dir,
      corsProxy: 'https://cors.isomorphic-git.org',
      url: 'https://github.com/rhey-folio2/restoapp-data.git'
    }

    try{
      await clone(repo);

      await fs_promise.writeFile(`/test/test.json`, {
        hello: '# TEST'
      });

      await add({
        ...repo,
        filepath: 'test.json'
      });

      // await commit({
      //   ...repo,
      //   author: {
      //     name: 'Resto App',
      //     email: 'rhey@foliowebsites.com'
      //   },
      //   message: 'unsync commits'
      // });

      // const result = await push(repo);
      // console.log(`pushed`, result)
    }catch(e){
      console.log(e);
    }
  }

  // async sync() {
  //   const fs = new LightningFS(environment.fs_name);
  //   const fs_promise = fs.promises;

  //   const dir = '/';
  //   const repo = {
  //     fs,
  //     http,
  //     dir,
  //     corsProxy: 'https://cors.isomorphic-git.org',
  //     url: 'https://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@github.com/rhey-folio2/restoapp-data.git',
  //     branch: 'master'
  //   }

  //   try {
  //     await fs_promise.stat(`/.git`);

  //     await commit({
  //       ...repo,
  //       author: {
  //         name: 'Resto App',
  //         email: 'rhey@foliowebsites.com'
  //       },
  //       message: 'unsync commits'
  //     });

  //     const result = await push(repo);
  //     console.log(`push done`, result);
  //   } catch (e) {
  //     console.log(e);
  //     await clone(repo);
  //     console.log(`clone successful`)
  //   }
  // }
}
